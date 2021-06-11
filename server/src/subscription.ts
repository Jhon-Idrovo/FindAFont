import Stripe from "stripe";
import { stripe } from "./";
import { getOrCreateStripeCustomer } from "./customers";
import { db } from "./firebase";

//attach a payment method to the Stripe customer,
//subscribes to a Stripe palan, and saves the plan to Firestore
export async function createSubscription(uid: string, priceId: string) {
  //get the customer associated with the Firebase login account
  const customer = await getOrCreateStripeCustomer(uid);

  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: priceId }],
    payment_behavior: "default_incomplete",
    //we need the payment intent to complete the payment in the frontend
    expand: ["latest_invoice.payment_intent"],
  });

  return subscription;
}

//Cancel an active subscription and update the data in Firestore
export async function cancelSubscription(uid: string, subscriptionId: string) {
  //get the Stripe customer
  const customer = await getOrCreateStripeCustomer(uid);
  //Extra validation
  if (customer.metadata.uid !== uid) {
    throw new Error("Firebase uid does not match Stripe customer");
  }
  //cancel the subscription (at the end of the period)
  const subscription = stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
  return subscription;
}

//Returns all the Stripe subscriptions related to a Firestore user
export async function listUserSubscriptions(uid: string) {
  const customer = await getOrCreateStripeCustomer(uid);
  const subscriptions = await stripe.subscriptions.list({
    customer: customer.id,
  });
  return subscriptions;
}

//this creates a checkout session we can use in our frontend app to checkout
export async function createSubscriptionWithCheckout(
  priceId: string,
  uid: string
) {
  //Since we are using a suscription there is no need for generating line items in the frontend
  //Get the customer
  const customer = await getOrCreateStripeCustomer(uid);
  console.log("customer-getOrCreateStripeCustomer", customer);

  const URL = process.env.WEBAPP_URL;
  const session = await stripe.checkout.sessions.create({
    customer: customer.id,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${URL}/success`,
    cancel_url: `${URL}/cancel`,
  });
  console.log("checkout session-subscription", session);

  return session;
}

export async function createSubscriptionV2(
  uid: string,
  priceId: string,
  paymentMethod: string
) {
  const customer = await getOrCreateStripeCustomer(uid);
  //attach the payment method to the customer
  await stripe.paymentMethods.attach(paymentMethod, { customer: customer.id });
  //set the default payment method
  await stripe.customers.update(customer.id, {
    invoice_settings: { default_payment_method: paymentMethod },
  });

  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: priceId }],
    payment_behavior: "default_incomplete",
    //we need the payment intent to complete the payment in the frontend
    expand: ["latest_invoice.payment_intent"],
  });
  //stripe will try to make the transaction with the payment method provided previously
  const invoice = subscription.latest_invoice as Stripe.Invoice;
  const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;
  console.log(
    "---------------------------------------------------------------------payment intent:",
    paymentIntent
  );

  //Update the user's memberhsip on success
  if (paymentIntent.status === "succeeded") {
    console.log(
      "------------------------------------------------------------------------------------success"
    );

    await db
      .collection("users")
      .doc(uid)
      .set({ stripeId: customer.id }, { merge: true });
    await db
      .collection("users")
      .doc(uid)
      .collection("private")
      .doc("subscription")
      .set({ subscriptionType: "PRO" }, { merge: true });
  }
}

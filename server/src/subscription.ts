import { stripe } from "./";
import { getOrCreateStripeCustomer } from "./customers";

//this creates a checkout session we can use in our frontend app to checkout
export async function createSubscription(priceId: string, uid) {
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

import { stripe } from "./";
import { db } from "./firebase";
import Stripe from "stripe";

//get the Stripe customer assosiated to the user from firestore
export async function getOrCreateStripeCustomer(
  uid: string,
  params?: Stripe.AccountCreateParams
) {
  const userSnapshot = await db.collection("users").doc(uid).get();
  const { stripeId, name, email } = userSnapshot.data();
  if (!stripeId) {
    //create the user. The uid is related to the login account
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: { uid },
      ...params,
    });
    //update the firestore record
    userSnapshot.ref.update({ stripeId: customer.id });
    //return the stripe customer
    return customer;
  } else {
    return (await stripe.customers.retrieve(stripeId)) as Stripe.Customer;
  }
}

import { stripe } from "./";

//this creates a checkout session we can use in our frontend app to checkout
export async function createStripeCheckout(priceId: string) {
  //Since we are using a suscription there is no need for generating line items in the frontend
  const URL = process.env.WEBAPP_URL;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${URL}/success`,
    cancel_url: `${URL}/cancel`,
  });
  return session;
}

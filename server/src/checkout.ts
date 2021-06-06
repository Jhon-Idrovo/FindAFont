import { stripe } from "./";
import Stripe from "stripe";

//this creates a checkout session we can use in our frontend app to checkout
export async function createStripeCheckout(
  line_items: Stripe.Checkout.SessionCreateParams.LineItem[]
) {
  //ITEM EXAMPLE
  // {
  //   name: 'T-shirt',
  //   description: 'Comfortable cotton t-shirt',
  //   images: ['https://example.com/t-shirt.png'],
  //   amount: 500, (In cents, stripe always uses the lowest currency denomination)
  //   currency: 'usd',
  //   quantity: 1,
  // }
  const URL = process.env.WEBAPP_URL;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    success_url: `${URL}/success`,
    cancel_url: `${URL}/cancel`,
  });
  return session;
}

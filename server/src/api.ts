import express, { Request, Response, NextFunction, application } from "express";
export const app = express();
import cors from "cors";
import { auth, db } from "./firebase";
import { createSubscription } from "./subscription";
import { stripe } from ".";
import Stripe from "stripe";

app.use(express.json());
app.use(cors({ origin: true }));
app.use(decodeJWT);

//Checkout
//we need a user first for this to sync the stripe costumer and firebase user
app.post(
  "/checkout",
  runAsync(async (req: Request, res: Response) => {
    //we may only need to send the session id
    const user = validateUser(req);
    res.status(200).send(await createSubscription(req.body.priceId, user.uid));
  })
);

//to catch async errors
function runAsync(callback: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    callback(req, res, next).catch(next);
  };
}

async function decodeJWT(req: Request, res: Response, next: NextFunction) {
  //get the firebae auth token from the request
  if (req.headers?.authorization?.startsWith("Bearer ")) {
    const idToken = req.headers.authorization.split("Bearer ")[1];
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      req["decodedToken"] = decodedToken;
    } catch (err) {
      console.log(err);
    }
  }

  next();
}
/*
to validate and acces to the user
const user = validateUser(req)
*/

//WEBHOOKS
app.post("/provision-suscription", async (req: Request, res: Response) => {
  //Check if the webhook signin is configured
  let data;
  let eventType;
  const webhookSecret = process.env.WEBHOOK_SECRET;
  let event: Stripe.Event;
  if (webhookSecret) {
    //Retrieve the event by verifying the signature using the raw body secret
    const signature = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    data = event.data;
    eventType = event.type;
  } else {
    //if the secret is not configured,
    //retrieve the event data directly from the request body
    data = req.body.data;
    eventType = req.body.type;
  }
  switch (eventType) {
    case "checkout.session.completed":
      // Payment is successful and the subscription is created.
      // You should provision the subscription and save the customer ID to your database.
      //set the firebase user's membership to PRO
      // get the user web token

      return res.send({ received: true });

    case "invoice.paid":
      // Continue to provision the subscription as payments continue to be made.
      // Store the status in your database and check when a user accesses your service.
      // This approach helps you avoid hitting rate limits.
      return res.send({ received: true });
    case "invoice.payment_failed":
      // The payment failed or the customer does not have a valid payment method.
      // The subscription becomes past_due. Notify your customer and send them to the
      // customer portal to update their payment information.
      return res.send({ received: true });
    default:
      // Unhandled event type
      return res.send({ received: true });
  }
});

//thrown an error if the user is not logged in
function validateUser(req: Request) {
  const user = req["decodedToken"];
  console.log("USER api.ts 106", user);

  if (!user) {
    throw new Error("Logged needed");
  }
  return user;
}

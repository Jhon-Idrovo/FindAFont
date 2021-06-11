import express, { Request, Response, NextFunction, application } from "express";
export const app = express();
import cors from "cors";

import { auth, db } from "./firebase";
import {
  createSubscription,
  cancelSubscription,
  listUserSubscriptions,
} from "./subscription";
import { stripe } from ".";
import Stripe from "stripe";

app.use(cors({ origin: true }));
app.use(decodeJWT);
//use JSON parser for all non-webhook routes
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.originalUrl === "/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

//Subscription with Elements
app.post(
  "/subscription/create",
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);
    const { priceId } = req.body;
    const subscription = await createSubscription(user.uid, priceId);
    res.send(subscription);
  })
);
//list the subscriptions
app.get(
  "/subscription/list",
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);
    const subscriptions = await listUserSubscriptions(user.uid);
    res.send(subscriptions.data);
  })
);

//cancel the subscription
app.patch(
  "/subscription/cancel/:id",
  runAsync(async (req: Request, res: Response) => {
    const user = validateUser(req);
    const subscription = await cancelSubscription(user.uid, req.params.id);
    res.send(subscription);
  })
);
//WEBHOOKS---------------------------------------------------------
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    console.log(
      "-------------------------------------------------REQ=>",
      req.body,
      "--------------------------------------------------------------------------RES=>:"
    );
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
        console.log(
          "-------------------------------------------------EVENT---------------------------------------------------",
          event
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`);
        return res.sendStatus(400);
      }
      data = event.data.object;
      eventType = event.type;
    } else {
      //if the secret is not configured,
      //retrieve the event data directly from the request body
      data = req.body.data;
      eventType = req.body.type;
    }
    //relate the firebase user and the stripe customer
    const customer = (await stripe.customers.retrieve(
      data.customer
    )) as Stripe.Customer;
    console.log(
      "-------------------------------CUSTOMER---------------------------------------",
      customer
    );

    const uid = customer.metadata.uid;

    switch (eventType) {
      case "charge.succeeded":
        // Payment is successful and the subscription is created.
        //set the firebase user's membership to PRO
        console.log("PROVISON THE SUBSCRIPTION");
        //update the payment method
        const subscription_id = data.subscription;
        const paymentMethod = data.payment_method;
        await stripe.subscriptions.update(subscription_id, {
          default_payment_method: paymentMethod,
        });

        // const payment_intent_id = data.payment_intent;
        // const paymentIntent = stripe.paymentIntents.retrieve(payment_intent_id);
        //update the database
        await db
          .collection("users")
          .doc(uid)
          .collection("private")
          .doc("subscription")
          .set({ subscriptionType: "PRO", subscriptionId: subscription_id });

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
        await db
          .collection("users")
          .doc(uid)
          .collection("private")
          .doc("subscription")
          .set({
            subscriptionType: null,
            deleteOn: "date to delete the user data",
          });
        return res.send({ received: true });
      default:
        // Unhandled event type
        return res.send({ received: true });
    }
  }
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
      console.log("An error happened while decoding the JWT token", err);
    }
  }

  next();
}

//thrown an error if the user is not logged in
function validateUser(req: Request) {
  const user = req["decodedToken"];
  console.log("USER api.ts 106", user);

  if (!user) {
    throw new Error("Logged needed");
  }
  return user;
}

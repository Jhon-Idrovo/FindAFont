import express, { Request, Response, NextFunction } from "express";
export const app = express();
import cors from "cors";

app.use(express.json());
app.use(cors({ origin: true }));

import { createStripeCheckout } from "./checkout";

//Checkout
app.post(
  "/checkout",
  runAsync(async ({ body }: Request, res: Response) => {
    //we may only need to send the session id
    res.status(200).send(await createStripeCheckout(body.priceId));
  })
);

//to catch async errors
function runAsync(callback: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    callback(req, res, next).catch(next);
  };
}

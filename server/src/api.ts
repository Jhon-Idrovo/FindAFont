import express, { Request, Response, NextFunction } from "express";
export const app = express();
import cors from "cors";

app.use(express.json());
app.use(cors({ origin: true }));
app.post("/payment", (req: Request, res: Response) => {
  const { plan } = req.body;
  res.status(200).json({ success: true });
});

import { createStripeCheckout } from "./checkout";

//Checkout
app.post("/checkout", async ({ body }: Request, res: Response) => {
  res.status(200).json(await createStripeCheckout(body.line_items));
});

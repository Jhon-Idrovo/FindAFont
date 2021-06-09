import express, { Request, Response, NextFunction } from "express";
export const app = express();
import cors from "cors";
import { auth } from "./firebase";
import { createStripeCheckout } from "./checkout";

app.use(express.json());
app.use(cors({ origin: true }));
app.use(decodeJWT);
/*
to validate and acces to the user
const user = validateUser(req)
*/
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

async function decodeJWT(req: Request, res: Response, next: NextFunction) {
  //get the firebae auth token from the request
  if (req.headers?.authorization?.startsWith("Bearer ")) {
    const idToken = req.headers.authorization.split("Bearer ")[1];
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      req["currentUser"] = decodedToken;
    } catch (err) {
      console.log(err);
    }
  }

  next();
}

//thrown an error if the user is not logged in
function validateUser(req: Request) {
  const user = req["currentUser"];
  if (!user) {
    throw new Error("Logged needed");
  }
  return user;
}

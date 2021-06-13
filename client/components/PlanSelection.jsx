import { useState, useContext } from "react";
import { fetchFromAPI } from "../lib/utils";
import { UserContext } from "../lib/UserContext";
//elements
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
//reactfire
import { useUser } from "reactfire";

export default function PlanSelection() {
  const { user } = useContext(UserContext);
  const [priceId, setPriceId] = useState();
  const elemets = useElements();
  const stripe = useStripe();
  user ? console.log(user) : null;
  const handleSubmit = async (e) => {
    e.preventDefault();
    const card = elemets.getElement(CardElement);
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });
    if (error) {
      console.log(error);
      return;
    } else {
      const { latest_invoice } = await fetchFromAPI("subscription/create", {
        body: { priceId, paymentMethod: paymentMethod.id },
      });

      //the subscription contains the invoice with the payment intent that tells if the payment has been made
      //if the invoice's payment succeeded then we don't need to do anything
      //otherwise, confirmation is needed
      if (latest_invoice.payment_intent) {
        const { client_secret, status } = latest_invoice.payment_intent;
        //if 3d verification is needed
        if (
          status === "requires_action" ||
          status === "requires_confirmation"
        ) {
          const { error: confirmationError } = await stripe.confirmCardPayment(
            client_secret
          );
          if (confirmationError) {
            console.log(
              "An error happened trying to confirm the card payment:",
              confirmationError
            );
          } else {
            //success
            alert("You are subscribed");
          }
        }
      }
    }
  };

  return (
    <div>
      <h1>Select a subscription plan</h1>
      <button onClick={() => setPriceId("price_1Iyx9wHhEOvz8JaOSVCF6AJi")}>
        Mensual
      </button>
      <button onClick={() => setPriceId("price_1Iyx9wHhEOvz8JaOMOYdWrWV")}>
        Anually
      </button>
      <form onSubmit={handleSubmit}>
        <CardElement />
        <button disabled={!user ? true : false}>Pay</button>
        {!user ? <p>Please create a user first</p> : null}
      </form>
    </div>
  );
}

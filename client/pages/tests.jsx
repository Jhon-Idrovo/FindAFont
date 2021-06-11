import Checkout from "../components/Checkout";
import { useEffect, useState } from "react";
import SingIn from "../components/SingIn";
import axios from "axios";
import { db, auth } from "../lib/firebase";
import { fetchFromAPI } from "../lib/utils";
//elements
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

function Tests() {
  const user = auth.currentUser;
  return (
    <div>
      <SingIn />
      <PlanSelection user={user} />
    </div>
  );
}

export default Tests;

function TextFrame({ font, setActiveTextIndex, index }) {
  console.log(font);

  //variants and textarea
  return (
    <div>
      <textarea
        onClick={() => setActiveTextIndex(index)}
        style={{
          fontFamily: `${font.family},serif`,
        }}
        cols="30"
        rows="10"
      ></textarea>
    </div>
  );
}

function userData({ user }) {
  //USER HANDLING
  const [userData, setUserData] = useState({});

  useEffect(() => {
    function unsubscribe() {
      const userInfo = db
        .collection("users")
        .doc(user.uid)
        .onSnapshot((doc) => setUserData(doc.data()));
      //what happens when the user does not have this record?
      const userMembership = db
        .collection("users")
        .doc(user.uid)
        .collection("private")
        .doc("subscription")
        .onSnapshot((doc) =>
          setUserData((prev) => ({ ...prev, ...doc.data() }))
        );
      return () => userInfo() && userMembership();
    }

    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <div>
      User id: {userData.stripeId}
      Subscription: {userData.subscriptionType}
    </div>
  );
}

function PlanSelection({ user = null }) {
  const [priceId, setPriceId] = useState();
  const [subscription, setSubscription] = useState();
  //SUBSCRIPTION FORM
  const createSubscription = async () => {
    const subscription = await fetchFromAPI("subscription/create", {
      body: {
        priceId,
      },
    });
    console.log(subscription);
    setSubscription(subscription);
  };

  if (!user) {
    return <div>Please Login first</div>;
  }
  return (
    <div>
      <h1>Select an option</h1>
      <button onClick={() => setPriceId("price_1Iyx9wHhEOvz8JaOSVCF6AJi")}>
        Mensual
      </button>
      <button onClick={() => setPriceId("price_1Iyx9wHhEOvz8JaOMOYdWrWV")}>
        Anuallyyyy
      </button>
      {subscription ? (
        <CheckoutForm
          clientSecret={
            subscription.latest_invoice.payment_intent.client_secret
          }
        />
      ) : (
        <button onClick={createSubscription}>Create Sub</button>
      )}
    </div>
  );
}

function CheckoutForm({ clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();

  const submitPayment = async (e) => {
    e.preventDefault();
    if (!elements || !stripe) {
      //Make sure to disable form submission
      console.log("Stripe has not loaded yet");
      return;
    }
    //get the card element with the payment information
    const cardElement = elements.getElement(CardElement);
    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement, billing_details: { name: "test" } },
    });
    error ? console.log(error) : console.log("payment done!");
  };
  return (
    <form onSubmit={submitPayment}>
      <CardElement />
      <button>Pay</button>
    </form>
  );
}

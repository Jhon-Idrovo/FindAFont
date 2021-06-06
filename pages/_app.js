import Head from "next/head";

import "../styles/global.css";
import NavBar from "../components/NavBar";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

export const stripePromise = loadStripe(
  "pk_test_51Iyx5dHhEOvz8JaOeTtCEBXMSff06WroQUgQ3ipHwrJpERmx1uPd2S50weOJFRo6JRxxpbrUXvViNMudhE0hR9S700hzAOsrqs"
);

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />

        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Elements stripe={stripePromise}>
        <NavBar />
        <Component {...pageProps} />
      </Elements>
    </>
  );
}

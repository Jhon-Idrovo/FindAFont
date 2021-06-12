//Nextjs
import Head from "next/head";
//locals
import "../styles/global.css";
import NavBar from "../components/NavBar";
import { firebaseConfig } from "../lib/firebase";
//stripe
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
//react query
import { QueryClient, QueryClientProvider } from "react-query";
//react-fire
import "firebase/firestore";
import { FirebaseAppProvider } from "reactfire";

export const stripePromise = loadStripe(
  "pk_test_51Iyx5dHhEOvz8JaOeTtCEBXMSff06WroQUgQ3ipHwrJpERmx1uPd2S50weOJFRo6JRxxpbrUXvViNMudhE0hR9S700hzAOsrqs"
);

// Create a react-query client
const queryClient = new QueryClient();
export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Learn how to build a personal website using Next.js"
        />

        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* font-awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
          integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </Head>
      <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        <QueryClientProvider client={queryClient}>
          <Elements stripe={stripePromise}>
            <NavBar />
            <Component {...pageProps} />
          </Elements>
        </QueryClientProvider>
      </FirebaseAppProvider>
    </>
  );
}

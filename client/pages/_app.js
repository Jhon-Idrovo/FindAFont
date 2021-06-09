//Nextjs
import Head from "next/head";
//locals
import "../styles/global.css";
import NavBar from "../components/NavBar";
//stripe
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
//react query
import { QueryClient, QueryClientProvider } from "react-query";

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
      </Head>
      <QueryClientProvider client={queryClient}>
        <Elements stripe={stripePromise}>
          <NavBar />
          <Component {...pageProps} />
        </Elements>
      </QueryClientProvider>
    </>
  );
}

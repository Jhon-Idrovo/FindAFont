import { useState } from "react";
import {fetchCheckout} from '../lib/utils'
import {useStripe} from '@stripe/react-stripe-js'

function Checkout() {
  const stripe = useStripe()

  const [priceId, setPriceId] = useState('price_1Iyx9wHhEOvz8JaOMOYdWrWV');
  
  const handleCheckout = async (priceId) => {
        const {sessionId}= await fetchCheckout(priceId)      
        const {error} = stripe.redirectToCheckout({sessionId})
        error?console.log(error):null;
    }
  return <div><h1>Select an option</h1>
  <button onClick={()=>setPriceId('price_1Iyx9wHhEOvz8JaOSVCF6AJi')} >Mensual</button>
  <button onClick={()=>setPriceId('price_1Iyx9wHhEOvz8JaOMOYdWrWV')} >Anually</button>
  <button onClick={}>Checkout</button>
  </div>;
}

export default Checkout;

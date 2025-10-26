import React from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

const StripeCheckoutForm = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://shoppy-ecommerce-by-thalir.onrender.com/orders'
      }
    });

    if (result.error) {
      alert(result.error.message);
    } else if (result.paymentIntent.status === 'succeeded') {
      onSuccess(result.paymentIntent.id); // Call createOrder with paymentIntentId
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button className="btn btn-success mt-3" type="submit" disabled={!stripe}>
        Pay & Place Order
      </button>
    </form>
  );
};

export default StripeCheckoutForm;

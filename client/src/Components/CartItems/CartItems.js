import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import { UilX } from '@iconscout/react-unicons';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripeCheckoutForm from '../../Components/StripeCheckoutForm/StripeCheckoutForm';
import 'bootstrap/dist/css/bootstrap.min.css';

const stripePromise = loadStripe('pk_test_51SMBTJGV2MboLWcTNtG9Z3URfLegcwjlRp0O628Q5UczdXIii1gc0pRUmWhjQW8cyQmYWXjxDByNcXlwWPjVQFr400Scm1Tz5u'); // Replace with your actual public key

const CartItems = () => {
  const {
    getTotalCartAmount,
    all_product,
    cartItems,
    removeFromCart,
    setCartItems,
    getDefaultCart
  } = useContext(ShopContext);

  const navigate = useNavigate();
  const [method, setMethod] = useState('COD');
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentIntentId, setPaymentIntentId] = useState(null);

  const token = localStorage.getItem('auth-token');

  const items = Object.entries(cartItems)
    .filter(([id, qty]) => qty > 0)
    .map(([id, qty]) => {
      const product = all_product.find(p => p.id === Number(id));
      return {
        productId: product._id,
        quantity: qty
      };
    });

  const createOrder = async (confirmedPaymentIntentId) => {
    const body = {
      items,
      totalAmount: getTotalCartAmount(),
      paymentMethod: method,
      paymentIntentId: confirmedPaymentIntentId
    };

    const res = await fetch('https://shoppy-server-by-thalir.onrender.com/createorder', {
      method: 'POST',
      headers: {
        'auth-token': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    console.log('Order creation response:', data); // ✅ Add this to debug

    if (data.success) {
      setCartItems(getDefaultCart());
      navigate('/Orders');
    } else {
      alert('Order failed: ' + data.error);
    }
  };

  const handleCODOrder = () => {
    createOrder();
  };

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      if (method === 'Stripe') {
        const res = await fetch('https://shoppy-server-by-thalir.onrender.com/create-payment-intent', {
          method: 'POST',
          headers: {
            'auth-token': token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ amount: getTotalCartAmount() })
        });

        const data = await res.json();
        console.log('Stripe response:', data);
        if (data.clientSecret && data.paymentIntentId) {
          setClientSecret(data.clientSecret);
          setPaymentIntentId(data.paymentIntentId);
        } else {
          alert('Failed to initialize Stripe payment');
        }
      }
    };

    fetchPaymentIntent();
  }, [method]);

  return (
    <div className="container my-5">
      <h3 className="mb-4 text-center">Your Cart</h3>
      <div className="table-responsive mb-5">
        <table className="table table-bordered text-center align-middle">
          <thead className="table-light">
            <tr>
              <th>Product</th>
              <th>Title</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {all_product.map((e) => {
              if (cartItems[e.id] > 0) {
                return (
                  <tr key={e.id}>
                    <td><img src={e.image} alt={e.name} style={{ maxHeight: '80px' }} className="img-fluid" /></td>
                    <td>{e.name}</td>
                    <td>₹{e.new_price}</td>
                    <td><span className="btn btn-outline-secondary">{cartItems[e.id]}</span></td>
                    <td>₹{e.new_price * cartItems[e.id]}</td>
                    <td>
                      <UilX
                        className="text-danger"
                        style={{ cursor: 'pointer' }}
                        onClick={() => removeFromCart(e.id)}
                      />
                    </td>
                  </tr>
                );
              }
              return null;
            })}
          </tbody>
        </table>
      </div>

      <h4 className="mb-3">Delivery Information</h4>
      <form className="row g-3 mb-5">
        <div className="col-md-6"><input type="text" className="form-control" placeholder="First name" /></div>
        <div className="col-md-6"><input type="text" className="form-control" placeholder="Last name" /></div>
        <div className="col-md-6"><input type="email" className="form-control" placeholder="Email address" /></div>
        <div className="col-md-6"><input type="text" className="form-control" placeholder="Street" /></div>
        <div className="col-md-6"><input type="text" className="form-control" placeholder="City" /></div>
        <div className="col-md-6"><input type="text" className="form-control" placeholder="State" /></div>
        <div className="col-md-6"><input type="number" className="form-control" placeholder="Zipcode" /></div>
        <div className="col-md-6"><input type="text" className="form-control" placeholder="Country" /></div>
        <div className="col-12"><input type="number" className="form-control" placeholder="Phone" /></div>
      </form>

      <div className="row mb-5">
        <div className="col-md-6">
          <h4>Cart Totals</h4>
          <ul className="list-group">
            <li className="list-group-item d-flex justify-content-between"><span>Subtotal</span><span>₹{getTotalCartAmount()}</span></li>
            <li className="list-group-item d-flex justify-content-between"><span>Shipping Fee</span><span>Free</span></li>
            <li className="list-group-item d-flex justify-content-between fw-bold"><span>Total</span><span>₹{getTotalCartAmount()}</span></li>
          </ul>
        </div>
      </div>

      <h4 className="mb-3">Payment Method</h4>
      <div className="d-flex gap-3 mb-4">
        <div className={`border p-3 d-flex align-items-center cursor-pointer ${method === 'Stripe' ? 'border-success' : ''}`} onClick={() => setMethod('Stripe')}>
          <input type="radio" checked={method === 'Stripe'} readOnly className="form-check-input me-2" />
          <span>Stripe</span>
        </div>
        <div className={`border p-3 d-flex align-items-center cursor-pointer ${method === 'COD' ? 'border-success' : ''}`} onClick={() => setMethod('COD')}>
          <input type="radio" checked={method === 'COD'} readOnly className="form-check-input me-2" />
          <span>Cash on Delivery</span>
        </div>
      </div>

      {method === 'Stripe' && clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <StripeCheckoutForm onSuccess={createOrder} />
        </Elements>
      )}

      {method === 'COD' && (
        <div className="text-end">
          <button className="btn btn-dark px-5 py-2" onClick={handleCODOrder}>
            PLACE ORDER
          </button>
        </div>
      )}
    </div>
  );
};

export default CartItems;

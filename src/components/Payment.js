import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './Payment.css';

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { products, totalPrice } = location.state || { products: [], totalPrice: 0 };

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');  // Added error message state

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cardNumber' && value.length <= 16 && /^[0-9]*$/.test(value)) {
      setPaymentDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    } else if (name === 'cvv' && value.length <= 3 && /^[0-9]*$/.test(value)) {
      setPaymentDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    } else if (name !== 'cardNumber' && name !== 'cvv') {
      setPaymentDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setIsPaymentProcessing(true);
    setErrorMessage('');  // Clear previous errors

    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You need to log in to make a payment.');
        navigate('/login');  // Redirect user to login page if no token exists
        return;
      }

      // Make the payment request without CSRF token
      const response = await axios.post(
        'http://localhost:8000/api/payment/',
        {
          paymentDetails,
          products,
          totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token in the Authorization header
            'Content-Type': 'application/json',
          },
        }
      );

      // Handle successful payment response
      if (response.status === 200) {
        alert('Payment successful!');
        const productId = products[0].product_id;
        navigate(`/delivery/${productId}`);  // Redirect to delivery page after successful payment
      } else {
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      // Handle errors
      console.error('Error processing payment:', error);
      setErrorMessage('An error occurred while processing your payment.');  // Show error message
      if (error.response && error.response.status === 401) {
        alert('Unauthorized. Please log in again.');
        navigate('/login');  // Redirect to login if unauthorized
      }
    } finally {
      setIsPaymentProcessing(false);
    }
  };

  return (
    <div className="payment-container">
      <h1>Payment Page</h1>

      <div className="product-list">
        <h2>Products</h2>
        {products.length > 0 ? (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.product_id} className="product-item">
                <h3>{product.product_name}</h3>
                <p>Price: ${product.price}</p>
                <p>Quantity: {product.quantity}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No products found in your purchase.</p>
        )}

        <div className="total-price">
          <h3>Total Price: ${totalPrice.toFixed(2)}</h3>
        </div>
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}  {/* Display error message */}

      <form onSubmit={handleSubmitPayment} className="payment-form">
        <h3>Payment Details</h3>
        <div className="form-field">
          <label>Card Number (16 digits):</label>
          <input
            type="text"
            name="cardNumber"
            value={paymentDetails.cardNumber}
            onChange={handleInputChange}
            maxLength="16"
            pattern="\d{16}"
            placeholder="Enter 16-digit card number"
            required
          />
        </div>

        <div className="form-field">
          <label>Expiry Date:</label>
          <input
            type="text"
            name="expiryDate"
            value={paymentDetails.expiryDate}
            onChange={handleInputChange}
            placeholder="MM/YY"
            required
          />
        </div>

        <div className="form-field">
          <label>CVV (3 digits):</label>
          <input
            type="text"
            name="cvv"
            value={paymentDetails.cvv}
            onChange={handleInputChange}
            maxLength="3"
            pattern="\d{3}"
            placeholder="Enter 3-digit CVV"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isPaymentProcessing}>
            {isPaymentProcessing ? 'Processing Payment...' : 'Pay Now'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Payment;

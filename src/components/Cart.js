import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';

// Utility function to get CSRF token from cookies
const getCSRFToken = () => {
  const name = 'csrftoken';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/display-on-cart/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(response.data);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        alert('Could not fetch cart items.');
      }
    } else {
      alert('Please log in to view your cart.');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleRemoveFromCart = async (productId) => {
    const token = localStorage.getItem('token');
    const csrfToken = getCSRFToken();

    if (token && csrfToken) {
      try {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.product_id === productId ? { ...item, loading: true } : item
          )
        );

        const response = await axios.delete('http://127.0.0.1:8000/api/cart/remove/', {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-CSRFToken': csrfToken,
          },
          params: { product_id: productId },
        });

        if (response.status === 200) {
          setCartItems((prevItems) =>
            prevItems.filter((item) => item.product_id !== productId)
          );
        } else {
          alert('Failed to remove the product.');
        }
      } catch (error) {
        console.error('Error removing product:', error);
        alert('Error removing product from cart');
      }

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.product_id === productId ? { ...item, loading: false } : item
        )
      );
    } else {
      alert('Please log in to remove items from your cart.');
      navigate('/login');
    }
  };

  const handleClearCart = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axios.delete('http://127.0.0.1:8000/api/cart/clear/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems([]);
      } catch (error) {
        console.error('Error clearing cart:', error);
        alert('Could not clear cart.');
      }
    }
  };


  // Function to send data to the backend using axios

  const postPurchaseData = async (data) => {
    const token = localStorage.getItem('token');  // Retrieve token from localStorage
  
    if (!token) {
      alert('You need to log in to make a purchase.');
      return null;
    }
  
    try {
      const response = await axios.post('http://localhost:8000/api/purchase/', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Include only the Bearer token
        },
      });
  
      if (response.status !== 200) {
        throw new Error(`Failed to save purchase data: ${response.statusText}`);
      }
  
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      alert(`Failed to complete the purchase: ${error.message}`);
      return null;
    }
  };
  
  
  
  
  // Buy Single Product
  const handleBuyItem = async (product) => {
    const data = {
      products: [{ product_id: product.product_id, quantity: product.quantity, price: product.price }],
      totalPrice: product.price * product.quantity,
    };
  
    const purchaseResponse = await postPurchaseData(data);
  
    if (purchaseResponse) {
      // If the API responds successfully, navigate to the payment page
      navigate('/payment', { state: { products: data.products, totalPrice: data.totalPrice } });
    } else {
      alert('Purchase failed. Please try again.');
    }
  };
  
  // Buy All Products
  const handleBuyAll = async () => {
    const products = cartItems.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));
  
    const totalPrice = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
    const data = { products, totalPrice };
  
    const purchaseResponse = await postPurchaseData(data);
  
    if (purchaseResponse) {
      // If the API responds successfully, navigate to the payment page
      navigate('/payment', { state: { products, totalPrice } });
    } else {
      alert('Purchase failed. Please try again.');
    }
  };
  


  return (
    <div className={`dashboard-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div className={`dashboard-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
        </button>
        <nav className="nav-links">
          <Link to="/index"><button className="dashboard-btn">Home</button></Link>
          <Link to="/profile"><button className="dashboard-btn">Profile</button></Link>
          <Link to="/cart"><button className="dashboard-btn">Cart</button></Link>
          <button className="dashboard-btn logout-btn" onClick={handleLogout}>Logout</button>
        </nav>
      </div>

      <div className="main-content">
        <h1>Your Cart</h1>
        <h2>Product List</h2>
        <div className="products-grid">
          {cartItems.length > 0 ? (
            cartItems.map((item) => {
              const price = parseFloat(item.price) || 0;
              const quantity = item.quantity || 0;
              const totalPrice = price * quantity;

              return (
                <div key={item.product_id} className="product-item">
                  <h3>{item.product_name}</h3>
                  <p>Price per item: ${price.toFixed(2)}</p>
                  <p>Quantity: {quantity}</p>
                  <p>Total Price: ${totalPrice.toFixed(2)}</p>
                  <button
                    onClick={() => handleRemoveFromCart(item.product_id)}
                    disabled={item.loading}
                  >
                    {item.loading ? 'Removing...' : 'Remove'}
                  </button>
                  <button onClick={() => handleBuyItem(item)}>
                    Buy for ${totalPrice.toFixed(2)}
                  </button>
                </div>
              );
            })
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>

        {cartItems.length > 0 && (
          <button className="checkout-btn" onClick={handleBuyAll}>
            Buy All for ${cartItems.reduce(
              (acc, item) => acc + parseFloat(item.price || 0) * (item.quantity || 0),
              0
            ).toFixed(2)}
          </button>
        )}

        <button className="checkout-btn" onClick={handleClearCart}>
          Clear Cart
        </button>
      </div>
    </div>
  );
}

export default Cart;

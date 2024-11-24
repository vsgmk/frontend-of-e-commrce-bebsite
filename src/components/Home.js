import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';

// Modal component
const Modal = ({ isVisible, onClose, onLogin }) => {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Please Log in to Proceed</h2>
        <p>You need to be logged in to add products to the cart or like them.</p>
        <button onClick={onLogin} className="modal-button">Login</button>
        <button onClick={onClose} className="modal-button">Cancel</button>
      </div>
    </div>
  );
};

function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [likedProducts, setLikedProducts] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();


  
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/home/products/');
      const products = response.data.products || [];
      setProducts(products);
      setFilteredProducts(products);
    } catch (error) {
      setProducts([]);
      setFilteredProducts([]);
      console.error('Error fetching products:', error);
    }
  };

  const handleAddToCart = () => {
    setIsModalVisible(true);
  };

  const handleLike = () => {
    setIsModalVisible(true);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleLikeToggle = (productId) => {
    setLikedProducts((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId],
    }));
  };

  return (
    <div className="home-container">
      <div className="auth-buttons">
        <button onClick={handleLogin} className="auth-button">Login</button>
        <button onClick={handleRegister} className="auth-button">Register</button>
      </div>

      <h1 className="home-heading">Welcome to Our Platform</h1>
      <p className="home-description">Browse our products below.</p>

      <div className="product-list">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <h3 className="product-name">{product.name}</h3>
            <img
              src={product.image_url}
              alt={product.name}
              className="product-image"
            />
            <p className="product-description">{product.description}</p>
            <p className="product-price">${product.price}</p>
            <button
              onClick={() => { handleLike(product.id); handleLikeToggle(product.id); }}
              className={`like-button ${likedProducts[product.id] ? 'liked' : ''}`}>
              {likedProducts[product.id] ? '💗' : '❤'}
            </button>
            <button onClick={() => handleAddToCart(product.id)} className="add-to-cart-btn">
  Add to Cart
</button>
          </div>
        ))}
      </div>

      <Modal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        onLogin={handleLogin}
      />
    </div>
  );
}

export default Home;

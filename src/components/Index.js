import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './Index.css';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';

function Index() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [productData, setProductData] = useState({ name: '', description: '', price: '', image: null });
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();
  

  useEffect(() => {
    checkUserStatus();
    fetchProducts();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const checkUserStatus = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/check-superuser-status/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsSuperUser(response.data.is_superuser);
      } catch (error) {
        console.error('Error checking user status:', error);
      }
    }
  };

// ProductList Component
const ProductList = ({ products, handleAddToCart, isSuperUser, handleEditProduct, handleDeleteProduct }) => {

};

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const formData = new FormData();
        formData.append('name', productData.name);
        formData.append('description', productData.description);
        formData.append('price', productData.price);
        formData.append('image', productData.image);

        const response = await axios.post('http://127.0.0.1:8000/api/add-product/', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 201) {
          const { name, description, price, imageUrl } = response.data;
          setProducts((prevProducts) => [
            ...prevProducts,
            { name, description, price, imageUrl },
          ]);
          setProductData({ name: '', description: '', price: '', image: null });
        } else {
          console.error('Failed to add product:', response.data);
        }
      } catch (error) {
        console.error('Error adding product:', error);
      }
    } else {
      console.error('Authorization token not found');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductData({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
    });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (token && editingProduct) {
      try {
        const formData = new FormData();
        formData.append('name', productData.name);
        formData.append('description', productData.description);
        formData.append('price', productData.price);
        if (productData.image) {
          formData.append('image', productData.image);
        }

        const response = await axios.put(
          `http://127.0.0.1:8000/api/product/update/${editingProduct.id}/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        setProducts(
          products.map((product) =>
            product.id === editingProduct.id ? response.data : product
          )
        );
        setEditingProduct(null);
        setProductData({ name: '', description: '', price: '', image: null });
      } catch (error) {
        console.error('Error updating product:', error);
      }
    }
  };

  const handleDeleteProduct = async (productId) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/product/delete/${productId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(products.filter((product) => product.id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Please log in to add items to the cart.');
      return;
    }
  
    const csrfToken = Cookies.get('csrftoken');
  
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/cart/add/`,
        { product_id: productId }, // Send only the ID here
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json',
          },
        }
      );
      setCartCount(response.data.cart_items_count);
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('There was an error adding the product to the cart. Please try again.');
    }
  };  
  
  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found in local storage');
      return;
    }
  
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/products/', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Ensure response.data.products is an array
      const products = response.data.products || [];
      setProducts(products);
      setFilteredProducts(products);
    } catch (error) {
      setProducts([]); // Reset on error
      setFilteredProducts([]);
      if (error.response) {
        console.error('Error response:', error.response.data);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
  };
  

return (
  <div className={`dashboard-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
    <button className="toggle-sidebar-button" onClick={toggleSidebar}>
      <div className="hamburger-icon">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </button>

    {isSidebarOpen && (
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
</div>
    )}

    <div className="main-content">
      <h1 className="dashboard-title">Welcome to the Watch Dashboard</h1>

      {isSuperUser ? (
        <div className="add-product-form">
          <h2>{editingProduct ? 'Update Product' : 'Add Product'}</h2>
          <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
            <input
              type="text"
              placeholder="Product Name"
              value={productData.name}
              onChange={(e) => setProductData({ ...productData, name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={productData.description}
              onChange={(e) => setProductData({ ...productData, description: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={productData.price}
              onChange={(e) => setProductData({ ...productData, price: e.target.value })}
              required
            />
            <input
              type="file"
              onChange={(e) => setProductData({ ...productData, image: e.target.files[0] })}
            />
            <button type="submit">{editingProduct ? 'Update Product' : 'Add Product'}</button>
          </form>
        </div>
      ) : (
        <p>Welcome to the product dashboard. Explore the available products below.</p>
      )}
          <div className="product-list">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <h3>{product.name}</h3>
                <img
                  src={product.image_url}  // The backend URL that serves the image
                  alt={product.name}
                  className="product-image"
                />
                <p>{product.description}</p>
                <p>${product.price}</p>
                {isSuperUser && (
                  <div className="admin-buttons">
                    <button onClick={() => handleEditProduct(product)}>Edit</button>
                    <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                    <button onClick={() => handleAddToCart(product.id)}>Add to Cart</button>
                  </div>
                )}
              </div>
            ))}
          </div>
    </div>
  </div>
);
};

export default Index;

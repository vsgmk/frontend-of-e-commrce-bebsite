import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import './Index.css';

function Index() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [productData, setProductData] = useState({ name: '', description: '', price: '', image: null });
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const [editingProduct, setEditingProduct] = useState(null);

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

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/products/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Ensure the token is stored in localStorage
  
    if (token) {
      try {
        const formData = new FormData();
        formData.append('name', productData.name);
        formData.append('description', productData.description);
        formData.append('price', productData.price);
        formData.append('image', productData.image); // Ensure 'productData.image' is the file object from the input
  
        const response = await axios.post('http://127.0.0.1:8000/api/add-product/', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (response.status === 201) {
          const { name, description, price, imageUrl } = response.data; // Get the image URL from the response
  
          // Update the product list with the new product, including the image URL
          setProducts((prevProducts) => [
            ...prevProducts,
            { name, description, price, imageUrl }, // Add the new product to the list
          ]);
  
          // Reset the form data
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


  // Function to break products into rows of 3
  const groupProductsIntoRows = (products) => {
    const rows = [];
    for (let i = 0; i < products.length; i += 3) {
      rows.push(products.slice(i, i + 3)); // Grouping in sets of 3
    }
    return rows;
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
  
        // Pass the editingProduct.id in the URL to specify the product
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
  
        // Update the product list with the updated product
        setProducts(products.map((product) =>
          product.id === editingProduct.id ? response.data : product
        ));
        setEditingProduct(null);
        setProductData({ name: '', description: '', price: '', image: null });
      } catch (error) {
        console.error('Error updating product:', error);
      }
    }
  };
  

// Handle Delete Product
const handleDeleteProduct = async (productId) => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      // Sending DELETE request to the correct URL with the productId
      await axios.delete(`http://127.0.0.1:8000/api/product/delete/${productId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Removing the deleted product from the state
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
    const csrfToken = Cookies.get('csrftoken');
    if (token) {
      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/api/cart/add/`,
          { product_id: productId },  // Send the product_id in the request body
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
    } else {
      alert('Please log in to add items to the cart.');
    }
  };
  
  return (
    <div className={`dashboard-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Sidebar Toggle Button with Hamburger Icon */}
      <button className="toggle-sidebar-button" onClick={toggleSidebar}>
        <div className="hamburger-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="dashboard-sidebar">
          <button onClick={() => navigate('/index')} className="sidebar-button">Home</button>
          <button onClick={() => navigate('/profile')} className="sidebar-button">Profile</button>
          <button onClick={() => navigate('/cart')} className="sidebar-button">Cart</button>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      )}

      <div className="main-content">
        <h1 className="dashboard-title">Welcome to the Watch Dashboard</h1>

        {/* Conditional Product Upload Form for SuperUser */}
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

          {/* Displaying Product List in Matrix Format */}
          <div className="product-matrix">
          {filteredProducts.length > 0 ? (
            groupProductsIntoRows(filteredProducts).map((row, index) => (
                <div key={index} className="product-row">
                {row.map((product) => (
                    <div key={product.id} className="product-card">
                    <h3>{product.name}</h3>
                    {product.image && <img src={`http://127.0.0.1:8000${product.image}`} alt={product.name} />}
                    <p>{product.description}</p>
                    <p>Price: ${product.price}</p>
                    <button onClick={() => handleAddToCart(product.id)}>
                        Add to Cart
                    </button>
                    {isSuperUser && (
                        <>
                        <button onClick={() => handleEditProduct(product)}>Edit</button>
                        <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                        </>
                    )}
                    </div>
                ))}
                </div>
            ))
            ) : (
            <p>No products available.</p>
            )}
          </div>
      </div>
    </div>
  );
}

export default Index;


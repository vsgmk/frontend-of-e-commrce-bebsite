// src/App.js

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import VerifyOtp from './components/VerifyOTP';
import Index from './components/Index';
import Register from './components/Register';
import Profile from './components/Profile';
import PasswordReset from './components/PasswordReset';
import Cart from './components/Cart';
import PurchaseHistory from './components/PurchaseHistory.js';
import AddProduct from './components/AddProduct';
import Payment from './components/Payment';
import Delivery from './components/Delivery';


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} /> {/* Home Page */}
        <Route path="/login" element={<Login />} /> {/* Login Page */}
        <Route path="/register" element={<Register />} /> {/* Registration Page */}
        <Route path="/verify-otp" element={<VerifyOtp />} /> {/* OTP Verification */}
        <Route path="/password-reset" element={<PasswordReset />} /> {/* Password Reset */}
        <Route path="/index" element={<Index />} /> {/* Dashboard */}
        <Route path="/profile" element={<Profile />} /> {/* User Profile */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/history" element={<PurchaseHistory />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/delivery/:productId" element={<Delivery />} />  {/* Dynamic route */}
      </Routes>
    </Router>
  );
}

export default App;

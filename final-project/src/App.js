import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Footer from './Footer';
import Login from './Login';
import Register from './Register';
import AboutUs from './AboutUs';
import Catalog from './Catalog';
import ProductDetails from './ProductDetails';
import NewsSection from './NewsSection';
import Cart from './Cart'; 
import products from './Items'; 

function App() {
    const [userEmail, setUserEmail] = useState('');
    const [cart, setCart] = useState([]);  
    const [isDark, setIsDark] = useState(false);
    const [showGifd, setShowGifd] = useState(false);
    const [showGifw, setShowGifw] = useState(false);

    const handleLogin = (email) => {
        setUserEmail(email);
    };

    const handleLogout = () => {
        setUserEmail('');
    };

    const handleAddToCart = (product) => {
        setCart(prevCart => {
            const productIndex = prevCart.findIndex(item => item.id === product.id);
            if (productIndex >= 0) {
                const updatedCart = [...prevCart];
                updatedCart[productIndex].count += 1;
                return updatedCart;
            } else {
                return [...prevCart, { ...product, count: 1 }];
            }
        });
    };

    const handleDeleteFromCart = (productId) => {
        setCart((prevCart) => {
            const productToRemove = prevCart.find((item) => item.id === productId);
            if (productToRemove.count > 1) {
                return prevCart.map((item) =>
                    item.id === productId ? { ...item, count: item.count - 1 } : item
                );
            } else {
                return prevCart.filter((item) => item.id !== productId);
            }
        });
    };

    const toggleThemed = () => {
      setIsDark(true);
      setShowGifd(true);  
    setTimeout(() => {
      setShowGifd(false);  
    }, 500)
  };
  const toggleThemew = () => {
    setIsDark(false);
    setShowGifw(true);  
  setTimeout(() => {
    setShowGifw(false);  
  }, 500)
};

    return (
        <div className={`App ${isDark ? 'dark' : 'light'}`}> 
            <Router>
                <Navbar userEmail={userEmail} onLogout={handleLogout} toggleThemed={toggleThemed} toggleThemew={toggleThemew}  isDark={isDark} showGifd={showGifd} showGifw={showGifw} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/aboutus" element={<AboutUs />} />
                    <Route path="/news" element={<NewsSection />} />
                    <Route path="/catalog" element={<Catalog onAddToCart={handleAddToCart} />} />
                    <Route path="/cart" element={<Cart cart={cart} onDelete={handleDeleteFromCart} />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                </Routes>
                <Footer />
            </Router>
        </div>
    );
}

export default App;

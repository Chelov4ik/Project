import React from 'react';
import { FaUser, FaCog, FaShoppingCart } from 'react-icons/fa';
import './Navbar.css';
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ userEmail, onLogout, toggleThemed, toggleThemew, showGifd, showGifw }) => { 
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); 
    navigate('/login');
  };

  const handleUserIconClick = () => {
    navigate('/login');
  };
  
  const handleCart = () => {
    navigate('/cart');
  };

  const maskEmail = (email) => {
    if (!email) return "";
    const maskedLocalPart = email.length > 4 ? `${email.slice(0, 3)}...${email.slice(-1)}` : email;
    return `${maskedLocalPart}`;
  };

  return (
    <div className='navbarCont'>  
      <Link to='/' className='CompName'>ECOMERCY</Link>
      <div className='navbarContItems'>
        <Link className='NavItem' to="/Home">Home</Link>
        <Link className='NavItem' to="/Catalog">Catalog</Link>
        <Link className='NavItem' to="/News">News</Link>
        <Link className='NavItem' to="/AboutUs">About Us</Link>
      </div>
      <div className='Icons'>
      <div style={{width:10,height:10}}>
        {showGifd && (
        <div>
          <img style={{width:100,height:100}} src="blackMan.gif" alt="GIF" />
        </div>
      )}
      {showGifw && (
        <div>
          <img style={{width:100,height:100}} src="blackKid.png" alt="GIF" />
        </div>
      )}
      </div>
        <FaShoppingCart onClick={handleCart} style={{ cursor: 'pointer', paddingRight:10 }} />
        <FaUser onClick={handleUserIconClick} style={{ cursor: 'pointer' }} />
        <div style={{ fontSize: 15 }}>{userEmail && <span>{maskEmail(userEmail)}</span>}</div> 
        <button onClick={toggleThemed} style={{width: 10,height:10,backgroundColor: 'black'}}> 
      </button>
        <button onClick={toggleThemew} style={{width: 10,height:10,backgroundColor: 'white',marginRight: 10}}></button>
        {userEmail && (
          <button onClick={handleLogout} style={{ marginLeft: '10px' }}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;

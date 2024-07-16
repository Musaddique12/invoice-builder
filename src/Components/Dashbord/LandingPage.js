// src/Components/Dashbord/LandingPage.js
import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faReceipt } from '@fortawesome/free-solid-svg-icons';
import './LandingPage.css';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate()
  useEffect(()=>{
    localStorage.removeItem('invoice_type')
  },[])
  return (
   <div id='body'>
     <div id="landing-page" >
      <div id="overlay"></div>
      <h1 >Welcome to Our Service</h1>
      <p id="description" style={{margin:'16px'}}>Save your products data which you buy and sell </p>
            <p id="description" style={{margin:'16px'}}>Choose an option to get started:</p>
      <div id="options">
        <div id="option" onClick={() => navigate('/dashboard',{state:'buy'},localStorage.setItem('invoice_type','buy'))}>
          <FontAwesomeIcon icon={faShoppingCart} size="2x" />
          <span>Buy Product</span>
        </div>
        <div id="option" onClick={() => navigate('/dashboard',{state:'sell'},localStorage.setItem('invoice_type','sell'))}>
          <FontAwesomeIcon icon={faReceipt} size="2x" />
          <span>Sell Product</span>
        </div>
      </div>
    </div>
   </div>
  );
};

export default LandingPage;

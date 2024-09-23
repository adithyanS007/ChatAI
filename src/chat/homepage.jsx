// HomePage.js
import React from 'react';
import './homepage.css'; // Import styles for the HomePage
import logo from './assets/nexus.png'; // Import the logo image


const HomePage = ({ onStart }) => (
    <div className="home-container">
        
        <div className="logo">
            <img src={logo} alt="Logo" className="logo-image" />
        </div>
        <h1>Welcome to Nexus</h1>
        <p>Start your conversation with our AI assistant.</p>
        <button id="front" onClick={onStart}>Get Started</button>
    </div>
);

export default HomePage;

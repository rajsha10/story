import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import './Navbar.css';

function Navbar() {
  const [account, setAccount] = useState(null);

  // Function to connect wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  // Check if wallet is already connected
  useEffect(() => {
    const checkWalletConnected = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      }
    };
    checkWalletConnected();
  }, []);

  return (
    <nav className="navbar">
      <h1><Link to="/">STEWRY</Link></h1>
      <div className="nav-links">
        <Link to="/">Welcome</Link>
        <Link to="/feed">Stewries</Link>
        <Link to="/story-upload">Craft a Story</Link>
      </div>
      <div className="wallet-connection">
        {account ? (
          <p>Connected: {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}</p>
        ) : (
          <button onClick={connectWallet}>Connect Wallet</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

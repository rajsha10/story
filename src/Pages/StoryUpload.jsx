import React, { useState } from 'react';
import { ethers } from 'ethers';
import StewryABI from '../abis/Stewry.json';
import './StoryUpload.css';

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

function StoryUpload() {
  const [authorName, setAuthorName] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleUpload = async () => {
    if (!authorName || !title || !content || content.length <= 300) {
      setStatus('All fields are required, and content must be more than 300 characters.');
      return;
    }

    try {
      setLoading(true);
      setStatus('Connecting to wallet...');
      
      // Request account access
      if (!window.ethereum) {
        throw new Error('Please install MetaMask or another Web3 wallet');
      }
      
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Create provider and signer using ethers v6 syntax
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Create contract instance with proper typing
      const contract = new ethers.Contract(
        contractAddress,
        StewryABI,
        signer
      );

      setStatus('Uploading story to the AIA blockchain...');
      
      // Call the contract method and wait for transaction
      const tx = await contract.uploadStory(title, content);
      setStatus('Waiting for transaction confirmation...');
      await tx.wait();
      
      setStatus('Story uploaded successfully!');
      
      // Reset form
      setAuthorName('');
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error uploading story:', error);
      // Provide more specific error messages based on common issues
      if (error.code === 'ACTION_REJECTED') {
        setStatus('Transaction was rejected by user.');
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        setStatus('Insufficient funds for transaction.');
      } else {
        setStatus(`Error uploading story: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="story-upload">
      <h2>Craft Your Story</h2>
      <input
        type="text"
        placeholder="Author Name"
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        disabled={loading}
        required
      />
      <input
        type="text"
        placeholder="Story Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading}
        required
      />
      <textarea
        placeholder="Write your story content here (more than 300 characters)..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
        required
      />
      <button 
        onClick={handleUpload} 
        disabled={loading}
        className={loading ? 'loading' : ''}
      >
        {loading ? 'Crafting...' : 'Upload Story'}
      </button>
      {status && <p className="status-message">{status}</p>}
    </div>
  );
}

export default StoryUpload;
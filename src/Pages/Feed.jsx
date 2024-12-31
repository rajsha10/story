import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import StewryABI from '../abis/Stewry.json';
import './Feed.css';

const Feed = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingStoryId, setProcessingStoryId] = useState(null);
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

  // Fetch a single story's data
  const fetchStoryData = async (storyId, signer, contract) => {
    try {
      const story = await contract.stories(storyId);
      const preview = await contract.getPreview(storyId);
      const hasAccess = await contract.connect(signer).hasAccess(storyId);

      let fullContent = null;
      if (hasAccess) {
        try {
          fullContent = await contract.connect(signer).getFullStory(storyId);
        } catch (err) {
          console.error(`Error fetching full content for story ${storyId}:`, err);
        }
      }

      return {
        id: story.id.toString(),
        author: story.author,
        title: story.title,
        preview: preview,
        tips: ethers.formatEther(story.tips.toString()),
        hasAccess: hasAccess,
        fullContent: fullContent
      };
    } catch (error) {
      console.error(`Error fetching story ${storyId}:`, error);
      throw error;
    }
  };

  // Fetch all stories
  const fetchStories = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed.");
      }
  
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, StewryABI, provider);
  
      // Verify contract deployment
      const code = await provider.getCode(contractAddress);
      if (code === '0x') {
        throw new Error('Contract not deployed at specified address');
      }
  
      // Get story count with fallback
      let storyCount;
      try {
        storyCount = await contract.storyCount();
      } catch (error) {
        console.error("Error getting story count:", error);
        storyCount = 0;
      }
  
      let storiesData = [];
      for (let i = 1; i <= storyCount; i++) {
        try {
          const storyData = await fetchStoryData(i, signer, contract);
          storiesData.push(storyData);
        } catch (err) {
          console.error(`Skipping story ${i} due to error:`, err);
        }
      }
  
      setStories(storiesData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching stories:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  // Update a single story in the state
  const updateStory = async (storyId) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, StewryABI, provider);

      const updatedStory = await fetchStoryData(storyId, signer, contract);

      setStories(prevStories =>
        prevStories.map(story =>
          story.id === storyId ? updatedStory : story
        )
      );
    } catch (error) {
      console.error("Error updating story:", error);
    }
  };

  // Tip author to unlock story
  const tipAuthor = async (storyId) => {
    try {
      if (!window.ethereum) {
        throw new Error("Please connect MetaMask.");
      }

      setProcessingStoryId(storyId);
      setError(null);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, StewryABI, signer);

      const tipAmount = ethers.parseEther("1.5");
      console.log(`Sending tip of ${tipAmount} wei for story ${storyId}`);

      const tx = await contract.tipAuthor(storyId, { value: tipAmount });
      console.log('Transaction sent:', tx.hash);

      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      await new Promise(resolve => setTimeout(resolve, 2000));

      await updateStory(storyId);

    } catch (error) {
      console.error("Error tipping author:", error);
      setError(error.message);
    } finally {
      setProcessingStoryId(null);
    }
  };

  // Connect wallet function
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask");
      }
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      await fetchStories();
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    connectWallet();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', fetchStories);
      window.ethereum.on('chainChanged', fetchStories);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', fetchStories);
        window.ethereum.removeListener('chainChanged', fetchStories);
      }
    };
  }, []);

  return (
    <div className="feed-container">
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Loading stories...</div>
      ) : (
        stories.map((story) => (
          <div key={story.id} className="story-card">
            <h3 className="story-title">{story.title}</h3>
            <p className="author-info">
              Author: {`${story.author.slice(0, 6)}...${story.author.slice(-4)}`}
            </p>
            <div className="story-content">
              {story.hasAccess ? (
                <div>
                  <p>{story.fullContent}</p>
                  <p className="tips-info">Total Tips: {story.tips} AIA</p>
                </div>
              ) : (
                <div>
                  <p>{story.preview}...</p>
                  <button 
                    onClick={() => tipAuthor(story.id)}
                    disabled={processingStoryId === story.id}
                    className="tip-button"
                  >
                    {processingStoryId === story.id 
                      ? 'Processing Tip...' 
                      : 'Tip 1.5 AIA to Unlock Full Story'}
                  </button>
                </div>
              )}
            </div>
            {/* Like Button */}
            <button className="like-button">Like</button>
          </div>
        ))
      )}
    </div>
  );
};

export default Feed;

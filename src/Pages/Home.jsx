import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <section className="intro-section">
        <h1>Welcome to <span className="highlight">Stewry</span></h1>
        <p>
          Unleash your creativity in a decentralized space where stories and poems come to life on the blockchain.
          Stewry empowers creators to connect, share, and earn directly from their community.
        </p>
      </section>

      <section className="features-section">
        <h2>Key Features</h2>
        <div className="feature-card">
          <h3>🔗 Wallet Integration</h3>
          <p>Seamlessly connect your wallet to publish, interact, and earn.</p>
        </div>
        <div className="feature-card">
          <h3>✍️ Creative Expression</h3>
          <p>
            Share your original stories and poems with a community of readers and writers who value creativity.
          </p>
        </div>
        <div className="feature-card">
          <h3>💸 Monetization Model</h3>
          <p>
            Preview your work, let readers tip to unlock the full story, and earn directly from your audience.
          </p>
        </div>
        <div className="feature-card">
          <h3>💬 Community Engagement</h3>
          <p>
            Connect with your audience through comments and feedback, fostering a vibrant community of creatives.
          </p>
        </div>
        <div className="feature-card">
          <h3>🔐 Blockchain Benefits</h3>
          <p>
            Stewry ensures security and ownership of your intellectual property with blockchain technology.
          </p>
        </div>
      </section>

      <section className="why-stewry-section">
        <h2>Why Stewry?</h2>
        <p>
          Stewry embraces the Web3 shift, giving authors more control over their content and earnings.
          Here’s why our platform is essential in the Web3 space:
        </p>
        <ul className="reasons-list">
          <li><strong>Empowering Creators:</strong> Retain ownership and earn through direct audience support.</li>
          <li><strong>Decentralized Monetization:</strong> Immediate and intermediary-free compensation.</li>
          <li><strong>Community Building:</strong> Engage in a dedicated storytelling space for readers and writers alike.</li>
        </ul>
      </section>
    </div>
  );
};

export default Home;

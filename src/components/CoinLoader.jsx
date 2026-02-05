// src/components/CoinStackLoader.jsx
import React from 'react';
import styles from './CoinLoader.module.css';
// IMPORTANT: Replace this with the path to your transparent Rupee PNG
import rupeeCoinImage from '../assets/coin.png'; 

const CoinLoader = () => {
  // We'll stack 4 coins
  const coins = [1, 2, 3, 4];

  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loaderContent}>
        
        {/* The Coin Stack */}
        <div className={styles.stackWrapper}>
          {coins.map((_, index) => (
            <img 
              key={index}
              src={rupeeCoinImage} 
              alt="Rupee Coin" 
              className={styles.coin}
              style={{ 
                // Stagger the animation delay for a wave effect
                '--delay': `${index * 0.15}s`,
                // Stack order: Bottom coin is behind top coin
                zIndex: coins.length - index 
              }} 
            />
          ))}
          {/* Shadow beneath the stack */}
          <div className={styles.shadow}></div>
        </div>

        {/* Text Area */}
        <div className={styles.textWrapper}>
          <h2 className={styles.title}>Synchronizing Accounts...</h2>
          <p className={styles.subtitle}>Please wait while we secure your data.</p>
        </div>

      </div>
    </div>
  );
};

export default CoinLoader;
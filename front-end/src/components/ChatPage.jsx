import React, { useState } from 'react';
import styles from './ChatPage.module.css';

const ChatPage = () => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendClick = () => {
    console.log(inputValue);
    setInputValue(''); // Clear the input field after sending
  };

  return (
    <>
      <div className={styles['nav-bar']}>
        Chat-App
      </div>

      <div className={styles['chat-container']}>
        <div className={styles['my-msg']}>
          Hello!!
        </div>

        <div className={styles['other-msg']}>
          How are you?!
        </div>
      </div>

      <div className={styles['enter-msg']}>
        <input 
          type='text' 
          value={inputValue} 
          onChange={handleInputChange} 
        />
      </div>

      <div className={styles['btn']}>
        <button onClick={handleSendClick}>
          Send
        </button>
      </div>
    </>
  );
}

export default ChatPage;
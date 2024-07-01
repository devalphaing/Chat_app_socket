import React, { useEffect, useState } from 'react';
import styles from './ChatPage.module.css';

const ChatPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const name = prompt('Enter your name:');
    if (name) {
      setUserName(name);
    }
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendClick = () => {
    console.log(`${userName}: ${inputValue}`);
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
          placeholder={`Enter message, ${userName}`} 
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
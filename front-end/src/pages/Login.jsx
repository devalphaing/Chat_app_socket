import React, { useState } from 'react';
import styles from './Login.module.css';
import axios from 'axios'; 

const Login = ({setIsLoggedIn, setUserName}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async () => {
    console.log(username, password);
    try {
      const payload = {
        username,
        password
      }
      const response = await axios.post('http://localhost:8000/login', payload);
      console.log(response?.data?.status);
      if(response?.data?.status){
        setIsLoggedIn(true);
        setUserName(response?.data?.username);
        localStorage.setItem('token', response?.data?.token); // Store JWT token in localStorage
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleSignUp = async () => {
    console.log(username, password);
    try {
      const payload = {
        username,
        password
      }
      const response = await axios.post('http://localhost:8000/register', payload);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className={styles['login-card-container']}>
        <div className={styles['login-card']}>
          <div className={styles['login-card-input']}>
            <div className={styles['login-card-input-key']}>
              <div>User-Name: </div>
              <div>Password: </div>
            </div>
            <div className={styles['login-card-input-value']}>
              <input type='text' value={username} onChange={handleUsernameChange} />
              <input type='password' value={password} onChange={handlePasswordChange} />
            </div>
          </div>
          <div className={styles['login-card-btn-container']}>
            <div><button onClick={handleLogin}>Login</button></div>
            <div><button onClick={handleSignUp}>Signup</button></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Route,
  createRoutesFromElements
} from "react-router-dom";
import ChatPage from './pages/ChatPage';
import Login from './pages/Login';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.post('http://localhost:8000/verifyToken', { token });
          if (response.data.status) {
            setIsLoggedIn(true);
            setUserName(response.data.username);
          } else {
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('token');
      }
    };

    verifyToken();
  }, [])


  const ProtectedRoute = ({ element }) => {
    return isLoggedIn ? element : <Navigate to="/login" />;
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="*" element={isLoggedIn ? <Navigate to="/" replace /> : <Login setIsLoggedIn={setIsLoggedIn} setUserName={setUserName}/>} />
        <Route path="/" element={<ProtectedRoute element={<ChatPage userName={userName}/>} />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <Login setIsLoggedIn={setIsLoggedIn} setUserName={setUserName}/>} />
      </>
    )
  );

  return (
    <RouterProvider router={router} />
  );
}

export default App;

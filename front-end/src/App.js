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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const ProtectedRoute = ({ element }) => {
    return isLoggedIn ? element : <Navigate to="/login" />;
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="*" element={isLoggedIn ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/" element={<ProtectedRoute element={<ChatPage />} />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <Login />} />
      </>
    )
  );

  return (
    <RouterProvider router={router} />
  );
}

export default App;

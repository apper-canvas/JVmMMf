import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './store/userSlice';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ClothingItems from './pages/ClothingItems';
import Outfits from './pages/Outfits';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { initializeApperClient } from './services/apperService';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    // Initialize the ApperClient
    initializeApperClient();

    // Check if user is already logged in (ApperSDK maintains session)
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient("10eb70bbf9af478ca7dde4a50a8cab8d");
    
    // We only need to check if user session exists
    apperClient.healthCheck()
      .then(response => {
        if (response && response.data && response.data.userId) {
          // User is authenticated, get user data from local storage
          const storedUser = localStorage.getItem('apperUser');
          if (storedUser) {
            dispatch(setUser(JSON.parse(storedUser)));
          }
        }
      })
      .catch(error => {
        console.error("Authentication check failed:", error);
      });
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
      <Route path="/signup" element={!isAuthenticated ? <SignUp /> : <Navigate to="/" />} />
      
      <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
        <Route index element={<Dashboard />} />
        <Route path="clothing-items" element={<ClothingItems />} />
        <Route path="outfits" element={<Outfits />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
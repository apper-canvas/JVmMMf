import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    const apperClient = new ApperClient("10eb70bbf9af478ca7dde4a50a8cab8d");
    
    ApperUI.setup(apperClient, {
      target: '#authentication',
      clientId: "10eb70bbf9af478ca7dde4a50a8cab8d",
      view: 'login',
      onSuccess: function(user) {
        dispatch(setUser(user));
        navigate('/');
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
      }
    });
    
    ApperUI.showLogin("#authentication");
  }, [navigate, dispatch]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">MyWardrobe</h1>
          <p className="mt-2 text-gray-600">Sign in to manage your clothing collection</p>
        </div>
        <div id="authentication" className="min-h-[400px]" />
        <div className="text-center text-gray-600">
          <p>Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
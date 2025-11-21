import './App.css'
import Header from './components/Header'
import { Outlet } from 'react-router-dom'
import Footer from './components/Footer'
import { useState, useEffect } from 'react';
import authService from './codingsena/authService';
import { useDispatch } from 'react-redux';
import { login, logout } from './store/authSlice';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    ;(async () => {
      try {
        const user = await authService.getCurrentUser();
      if(user.success) {
        dispatch(login({userData : user.resource}));
      }
      else {
        dispatch(logout());
      }
      } catch (error) {
        dispatch(logout());
      }
      finally {
        setIsLoading(false);
      }
    })();
  }, []);
  
  if(isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <main>
        <Outlet/>
      </main>
      <Footer />
    </>
  )
}

export default App

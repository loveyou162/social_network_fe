import './App.css';
import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from './features/authSlice';
import axiosInstance from './api/axiosInstance';
import RootLayout from './pages/rootLayout';
import HomeAllPage from './pages/Home/home';
import MessagesPage from './pages/Messages/messages';
import PersonalPage from './pages/Personal-Page/page';
import LoginRedirect from './pages/Login/login';
import { initKeycloak } from './keycloak';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    id: 'root',
    children: [
      {
        index: true,
        element: <HomeAllPage />,
        id: 'home',
      },
      {
        path: 'messages',
        element: <MessagesPage />,
        id: 'messages',
      },
      {
        path: 'personal',
        element: <PersonalPage />,
        id: 'personal',
      },
      {
        path: 'profile/:id',
        element: <PersonalPage />,
        id: 'profile',
      },
      {
        path: 'login',
        element: <LoginRedirect />,
        id: 'login',
      },
    ],
  },
]);

function App() {
  const [ready, setReady] = useState(false);
  const dispatch = useDispatch();

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get('/auth/profile');
      dispatch(setUser(response.data));
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      // 1. Kiểm tra URL token (sau khi redirect từ Backend)
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get('token');

      if (tokenFromUrl) {
        dispatch(setToken(tokenFromUrl));
        window.history.replaceState({}, document.title, '/');
        await fetchProfile();
        setReady(true);
        return;
      }

      // 2. Nếu đã có token trong localStorage
      const existingToken = localStorage.getItem('access_token');
      if (existingToken) {
        await fetchProfile();
        setReady(true);
        return;
      }

      // 3. Khởi tạo Keycloak ngầm
      try {
        await initKeycloak();
      } catch (err) {
        console.warn('Keycloak init failed');
      }
      setReady(true);
    };

    initialize();
  }, [dispatch]);

  if (!ready) {
    return <div>Đang khởi tạo xác thực...</div>;
  }

  return <RouterProvider router={router} />;
}

export default App;

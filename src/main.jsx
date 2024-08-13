import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider.jsx';
import MainLayout from './pages/layouts/MainLayout.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import Index from './pages/Index.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import './index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Home } from 'lucide-react';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      {
        path: '/dashboard',
        element: <Dashboard />,
        children: [
          { index: true, element: <Index /> },
          { path: '/dashboard/profile', element: <Profile /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

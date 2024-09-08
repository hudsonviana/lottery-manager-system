import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider.jsx';
import MainLayout from './pages/layouts/MainLayout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import Index from './pages/dashboard/Index.jsx';
import Profile from './pages/dashboard/Profile.jsx';
import Settings from './pages/dashboard/Settings.jsx';
import Support from './pages/dashboard/Support.jsx';
import Admin from './pages/dashboard/Admin.jsx';
import PersistLogin from './components/PersistLogin.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import RequireGuest from './components/RequireGuest.jsx';
import Unauthorized from './pages/dashboard/Unauthorized.jsx';
import './index.css';

import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <PersistLogin />,
    children: [
      {
        path: '/',
        element: <MainLayout />,
        errorElement: <ErrorPage />,
        children: [
          {
            element: <RequireGuest />,
            children: [
              { index: true, element: <Home /> },
              { path: '/login', element: <Login /> },
              { path: '/register', element: <Register /> },
            ],
          },
        ],
      },
      {
        element: <RequireAuth allowedRoles={['USER', 'ADMIN']} />,
        children: [
          {
            path: '/dashboard',
            element: <Dashboard />,
            children: [
              { index: true, element: <Index /> },
              { path: 'profile', element: <Profile /> },
              { path: 'settings', element: <Settings /> },
              { path: 'support', element: <Support /> },
              { path: 'unauthorized', element: <Unauthorized /> },
              {
                element: <RequireAuth allowedRoles={['ADMIN']} />,
                children: [{ path: 'admin', element: <Admin /> }],
              },
            ],
          },
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
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

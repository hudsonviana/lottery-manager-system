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
import Users from './pages/dashboard/Users.jsx';
import User from './pages/dashboard/User.jsx';
import Games from './pages/dashboard/Games.jsx';
import Game from './pages/dashboard/Game.jsx';
import Contests from './pages/dashboard/Contests.jsx';
import Contest from './pages/dashboard/Contest.jsx';
import ContestGames from './pages/dashboard/ContestGames.jsx';
import Groups from './pages/dashboard/Groups.jsx';
import PersistLogin from './components/PersistLogin.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import RequireGuest from './components/RequireGuest.jsx';
import Unauthorized from './pages/dashboard/Unauthorized.jsx';
import LogoutPage from './pages/LogoutPage.jsx';
import { checkIsFromShutdown } from './loaders/checkIsFromShutdown.js';
import './index.css';

import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <PersistLogin />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <RequireGuest />,
        children: [
          {
            path: '/',
            element: <MainLayout />,
            children: [
              { index: true, element: <Home /> },
              { path: '/login', element: <Login /> },
              { path: '/register', element: <Register /> },
            ],
          },
          {
            path: '/logout/:token?',
            element: <LogoutPage />,
            loader: checkIsFromShutdown,
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
              { path: 'games', element: <Games /> },
              { path: 'games/:id', element: <Game /> },
              { path: 'contests', element: <Contests /> },
              { path: 'contests/:drawId', element: <Contest /> },
              { path: 'contests/:drawId/games', element: <ContestGames /> },
              { path: 'groups', element: <Groups /> },
              { path: 'settings', element: <Settings /> },
              { path: 'support', element: <Support /> },
              { path: 'unauthorized', element: <Unauthorized /> },
              {
                element: <RequireAuth allowedRoles={['ADMIN']} />,
                children: [
                  { path: 'admin', element: <Admin /> },
                  { path: 'users', element: <Users /> },
                  { path: 'users/:id', element: <User /> },
                ],
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

import { createBrowserRouter, Navigate } from 'react-router'
import PublicLayout from '@/layouts/PublicLayout'
import AuthLayout from '@/layouts/AuthLayout'
import UserLayout from '@/layouts/UserLayout'
import TradesmanLayout from '@/layouts/TradesmanLayout'
import AdminLayout from '@/layouts/AdminLayout'
import AuthGuard from '@/app/router/AuthGuard'
import RoleGuard from '@/app/router/RoleGuard'
import HomePage from '@/pages/public/home/HomePage'
import AboutPage from '@/pages/public/about/AboutPage'
import ContactPage from '@/pages/public/contact/ContactPage'
import ServicesPage from '@/pages/public/services/ServicesPage'
import HowItWorksPage from '@/pages/public/how-it-works/HowItWorksPage'
import PricingPage from '@/pages/public/pricing/PricingPage'
import JobDetailsPage from '@/pages/public/jobs/JobDetailsPage'
import DeveloperPage from '@/pages/public_page/DeveloperPage'
import LoginPage from '@/pages/auth/login/LoginPage'
import RegisterPage from '@/pages/auth/register/RegisterPage'
import UserDashboardPage from '@/pages/user/dashboard/UserDashboardPage'
import UserBookingsPage from '@/pages/user/bookings/UserBookingsPage'
import UserProfilePage from '@/pages/user/profile/UserProfilePage'
import MessagesPage from '@/pages/shared/MessagesPage'
import TradesmanDashboardPage from '@/pages/tradesman/dashboard/TradesmanDashboardPage'
import TradesmanJobsPage from '@/pages/tradesman/jobs/TradesmanJobsPage'
import TradesmanJobDetailsPage from '@/pages/tradesman/jobs/TradesmanJobDetailsPage'
import TradesmanSchedulePage from '@/pages/tradesman/schedule/TradesmanSchedulePage'
import TradesmanProfilePage from '@/pages/tradesman/profile/TradesmanProfilePage'
import AdminDashboardPage from '@/pages/admin/dashboard/AdminDashboardPage'
import AdminUsersPage from '@/pages/admin/users/AdminUsersPage'
import AdminTradesmenPage from '@/pages/admin/tradesmen/AdminTradesmenPage'
import AdminSettingsPage from '@/pages/admin/settings/AdminSettingsPage'
import NotFoundPage from '@/pages/error/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/developer',
    element: <DeveloperPage />,
  },
  {
    path: '/developer/:componentId',
    element: <DeveloperPage />,
  },
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'how-it-works', element: <HowItWorksPage /> },
      { path: 'pricing', element: <PricingPage /> },
      { path: 'jobs/:jobId', element: <JobDetailsPage /> },
    ],
  },
  {
    path: 'auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
  {
    path: 'user',
    element: <AuthGuard />,
    children: [
      {
        element: <RoleGuard allowedRoles={['user']} />,
        children: [
          {
            element: <UserLayout />,
            children: [
              { index: true, element: <Navigate to="dashboard" replace /> },
              { path: 'dashboard', element: <UserDashboardPage /> },
              { path: 'bookings', element: <UserBookingsPage /> },
              { path: 'messages', element: <MessagesPage /> },
              { path: 'profile', element: <UserProfilePage /> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: 'tradesman',
    element: <AuthGuard />,
    children: [
      {
        element: <RoleGuard allowedRoles={['tradesman']} />,
        children: [
          {
            element: <TradesmanLayout />,
            children: [
              { index: true, element: <Navigate to="dashboard" replace /> },
              { path: 'dashboard', element: <TradesmanDashboardPage /> },
              { path: 'jobs', element: <TradesmanJobsPage /> },
              { path: 'jobs/:jobId', element: <TradesmanJobDetailsPage /> },
              { path: 'messages', element: <MessagesPage /> },
              { path: 'schedule', element: <TradesmanSchedulePage /> },
              { path: 'profile', element: <TradesmanProfilePage /> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: 'admin',
    element: <AuthGuard />,
    children: [
      {
        element: <RoleGuard allowedRoles={['admin']} />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <Navigate to="dashboard" replace /> },
              { path: 'dashboard', element: <AdminDashboardPage /> },
              { path: 'users', element: <AdminUsersPage /> },
              { path: 'tradesmen', element: <AdminTradesmenPage /> },
              { path: 'settings', element: <AdminSettingsPage /> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

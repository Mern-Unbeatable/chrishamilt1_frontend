import { createBrowserRouter, Navigate } from 'react-router'
import PublicLayout from '@/layouts/PublicLayout'
import AuthLayout from '@/layouts/AuthLayout'
import TradesmanLayout from '@/layouts/TradesmanLayout'
import AdminLayout from '@/layouts/AdminLayout'
import AuthGuard from '@/app/router/AuthGuard'
import RoleGuard from '@/app/router/RoleGuard'
import HomePage from '@/pages/public/home/HomePage'
import AboutPage from '@/pages/public/about/AboutPage'
import ContactPage from '@/pages/public/contact/ContactPage'
import BrowseJobsPage from '@/pages/public/jobs/BrowseJobsPage'
import JobDetailsPage from '@/pages/public/jobs/JobDetailsPage'
import CategoriesPage from '@/pages/public/categories/CategoriesPage'
import HowItWorksPage from '@/pages/public/how-it-works/HowItWorksPage'
import PricingPage from '@/pages/public/pricing/PricingPage'
import DeveloperPage from '@/pages/public_page/DeveloperPage'
import LoginPage from '@/pages/auth/login/LoginPage'
import RegisterPage from '@/pages/auth/register/RegisterPage'
import SignUpPage from '@/pages/auth/signup/SignUpPage'
import DashboardComingSoonPage from '@/pages/shared/DashboardComingSoonPage'
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
      { path: 'services', element: <Navigate to="/jobs" replace /> },
      { path: 'jobs', element: <BrowseJobsPage /> },
      { path: 'categories', element: <CategoriesPage /> },
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
      { path: 'signup', element: <SignUpPage /> },
      { path: 'register', element: <RegisterPage /> },
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
              { path: 'dashboard', element: <DashboardComingSoonPage title="Dashboard" /> },
              { path: 'browse-jobs', element: <DashboardComingSoonPage title="Browse Jobs" /> },
              { path: 'quotes', element: <DashboardComingSoonPage title="My Quotes" /> },
              { path: 'jobs', element: <DashboardComingSoonPage title="My Jobs" /> },
              { path: 'jobs/:jobId', element: <DashboardComingSoonPage title="Job Details" /> },
              { path: 'messages', element: <DashboardComingSoonPage title="Messages" /> },
              { path: 'wallet', element: <DashboardComingSoonPage title="Wallet & Tokens" /> },
              { path: 'earnings', element: <DashboardComingSoonPage title="Earnings" /> },
              { path: 'reviews', element: <DashboardComingSoonPage title="Reviews" /> },
              { path: 'profile', element: <DashboardComingSoonPage title="My Profile" /> },
              { path: 'schedule', element: <Navigate to="/tradesman/dashboard" replace /> },
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
              { path: 'dashboard', element: <DashboardComingSoonPage title="Dashboard" /> },
              { path: 'customers', element: <DashboardComingSoonPage title="Customers" /> },
              { path: 'users', element: <Navigate to="/admin/customers" replace /> },
              { path: 'tradesmen', element: <DashboardComingSoonPage title="Tradesman" /> },
              { path: 'jobs', element: <DashboardComingSoonPage title="Jobs" /> },
              { path: 'categories', element: <DashboardComingSoonPage title="Categories" /> },
              { path: 'tokens', element: <DashboardComingSoonPage title="Token Management" /> },
              { path: 'profile', element: <DashboardComingSoonPage title="My Profile" /> },
              { path: 'settings', element: <Navigate to="/admin/profile" replace /> },
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

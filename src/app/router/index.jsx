import { createBrowserRouter, Navigate } from 'react-router'
import PublicLayout from '@/layouts/PublicLayout'
import AuthLayout from '@/layouts/AuthLayout'
import TradesmanLayout from '@/layouts/TradesmanLayout'
import AdminLayout from '@/layouts/AdminLayout'
import GuestGuard from '@/app/router/GuestGuard'
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
import UserGuard from '@/app/router/UserGuard'
import LoginPage from '@/pages/auth/login/LoginPage'
import RegisterPage from '@/pages/auth/register/RegisterPage'
import SignUpPage from '@/pages/auth/signup/SignUpPage'
import TradesmanDashboardPage from '@/pages/tradesman/dashboard/TradesmanDashboardPage'
import TradesmanBrowseJobsPage from '@/pages/tradesman/browse-jobs/TradesmanBrowseJobsPage'
import TradesmanBrowseJobDetailsPage from '@/pages/tradesman/browse-jobs/TradesmanBrowseJobDetailsPage'
import TradesmanQuotesPage from '@/pages/tradesman/quotes/TradesmanQuotesPage'
import TradesmanJobsPage from '@/pages/tradesman/jobs/TradesmanJobsPage'
import TradesmanJobDetailsPage from '@/pages/tradesman/jobs/TradesmanJobDetailsPage'
import TradesmanMessagesPage from '@/pages/tradesman/messages/TradesmanMessagesPage'
import TradesmanWalletPage from '@/pages/tradesman/wallet/TradesmanWalletPage'
import TradesmanEarningsPage from '@/pages/tradesman/earnings/TradesmanEarningsPage'
import TradesmanReviewsPage from '@/pages/tradesman/reviews/TradesmanReviewsPage'
import TradesmanProfilePage from '@/pages/tradesman/profile/TradesmanProfilePage'
import AdminCustomersPage from '@/pages/admin/customers/AdminCustomersPage'
import AdminTradesmenPage from '@/pages/admin/tradesmen/AdminTradesmenPage'
import AdminTradesmanDetailsPage from '@/pages/admin/tradesmen/AdminTradesmanDetailsPage'
import AdminJobsPage from '@/pages/admin/jobs/AdminJobsPage'
import AdminJobDetailsPage from '@/pages/admin/jobs/AdminJobDetailsPage'
import AdminJobQuotesPage from '@/pages/admin/jobs/AdminJobQuotesPage'
import AdminCategoriesPage from '@/pages/admin/categories/AdminCategoriesPage'
import AdminTokenManagementPage from '@/pages/admin/tokens/AdminTokenManagementPage'
import AdminDashboardPage from '@/pages/admin/dashboard/AdminDashboardPage'
import AdminSettingsPage from '@/pages/admin/settings/AdminSettingsPage'
import MessagesPage from '@/pages/shared/MessagesPage'
import UserProfilePage from '@/pages/user/profile/UserProfilePage'
import PostJobPage from '@/pages/user/jobs/PostJobPage'
import MyJobsPage from '@/pages/user/jobs/MyJobsPage'
import JobQuotesPage from '@/pages/user/jobs/JobQuotesPage'
import UserBookingsPage from '@/pages/user/bookings/UserBookingsPage'
import BookingDetailsPage from '@/pages/user/bookings/BookingDetailsPage'
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
      {
        element: <UserGuard />,
        children: [
          { path: 'post-job', element: <PostJobPage /> },
          { path: 'my-jobs', element: <MyJobsPage /> },
          { path: 'my-jobs/:jobId/quotes', element: <JobQuotesPage /> },
          { path: 'my-bookings', element: <UserBookingsPage /> },
          { path: 'my-bookings/:bookingId', element: <BookingDetailsPage /> },
          { path: 'messages', element: <MessagesPage /> },
          { path: 'user/profile', element: <UserProfilePage /> },
        ],
      },
    ],
  },
  {
    path: 'auth',
    element: <AuthLayout />,
    children: [
      {
        element: <GuestGuard />,
        children: [
          { path: 'login', element: <LoginPage /> },
          { path: 'signup', element: <SignUpPage /> },
          { path: 'register', element: <RegisterPage /> },
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
              { path: 'browse-jobs', element: <TradesmanBrowseJobsPage /> },
              { path: 'browse-jobs/:jobId', element: <TradesmanBrowseJobDetailsPage /> },
              { path: 'quotes', element: <TradesmanQuotesPage /> },
              { path: 'jobs', element: <TradesmanJobsPage /> },
              { path: 'jobs/:jobId', element: <TradesmanJobDetailsPage /> },
              { path: 'messages', element: <TradesmanMessagesPage /> },
              { path: 'wallet', element: <TradesmanWalletPage /> },
              { path: 'earnings', element: <TradesmanEarningsPage /> },
              { path: 'reviews', element: <TradesmanReviewsPage /> },
              { path: 'profile', element: <TradesmanProfilePage /> },
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
              { path: 'dashboard', element: <AdminDashboardPage /> },
              { path: 'customers', element: <AdminCustomersPage /> },
              { path: 'users', element: <Navigate to="/admin/customers" replace /> },
              { path: 'tradesmen', element: <AdminTradesmenPage /> },
              { path: 'tradesmen/:tradesmanId', element: <AdminTradesmanDetailsPage /> },
              { path: 'jobs', element: <AdminJobsPage /> },
              { path: 'jobs/:jobId', element: <AdminJobDetailsPage /> },
              { path: 'jobs/:jobId/quotes', element: <AdminJobQuotesPage /> },
              { path: 'categories', element: <AdminCategoriesPage /> },
              { path: 'tokens', element: <AdminTokenManagementPage /> },
              { path: 'profile', element: <AdminSettingsPage /> },
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

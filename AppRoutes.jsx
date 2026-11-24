import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Services from '../pages/Services';
import SignIn from '../pages/SignIn';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import BookService from '../pages/BookService';
import WorkerJoin from '../pages/WorkerJoin';
import WorkerOnboarding from '../pages/WorkerOnboarding';
import SupervisorOnboarding from '../pages/SupervisorOnboarding';
// Worker Dashboard Suite (Prompt 5)
import WorkerRouteGuard from '../components/auth/WorkerRouteGuard';
import WorkerDashboardOverview from '../pages/worker/DashboardOverview';
import WorkerProfile from '../pages/worker/WorkerProfile';
import WorkerSkills from '../pages/worker/WorkerSkills';
import FindWork from '../pages/worker/FindWork';
import JobRequests from '../pages/worker/JobRequests';
import ActiveJobs from '../pages/worker/ActiveJobs';
import CompletedJobs from '../pages/worker/CompletedJobs';
import WorkerVerification from '../pages/worker/WorkerVerification';
import WorkerIdCard from '../pages/worker/WorkerIdCard';
import WorkerEarnings from '../pages/worker/WorkerEarnings';
import PaymentSettings from '../pages/worker/PaymentSettings';
import WorkerSupport from '../pages/worker/WorkerSupport';
import WorkerSettings from '../pages/worker/WorkerSettings';
// Supervisor Dashboard Suite (Prompt 6)
import SupervisorRouteGuard from '../components/auth/SupervisorRouteGuard';
import SupervisorDashboardOverview from '../pages/supervisor/DashboardOverview';
import SupervisorProfile from '../pages/supervisor/SupervisorProfile';
import WorkerManagement from '../pages/supervisor/WorkerManagement';
import FindWorkers from '../pages/supervisor/FindWorkers';
import JobAssignments from '../pages/supervisor/JobAssignments';
import SupervisorProjects from '../pages/supervisor/Projects';
import ProjectDetail from '../pages/supervisor/ProjectDetail';
import ProjectProgress from '../pages/supervisor/ProjectProgress';
import CustomerRequests from '../pages/supervisor/CustomerRequests';
import SupervisorPayments from '../pages/supervisor/SupervisorPayments';
import Reports from '../pages/supervisor/Reports';
import SupervisorSupport from '../pages/supervisor/SupervisorSupport';
import SupervisorSettings from '../pages/supervisor/SupervisorSettings';
import Projects from '../pages/Projects';
import Verify from '../pages/Verify';
import Contractors from '../pages/Contractors';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Button from '../components/common/Button';

// Customer Dashboard Suite (Prompt 4)
import CustomerRouteGuard from '../components/auth/CustomerRouteGuard';
import DashboardOverview from '../pages/customer/DashboardOverview';
import BrowseServices from '../pages/customer/BrowseServices';
import ServiceDetail from '../pages/customer/ServiceDetail';
import WorkerDiscovery from '../pages/customer/WorkerDiscovery';
import CustomerBook from '../pages/customer/CustomerBook';
import BookingsOverview from '../pages/customer/BookingsOverview';
import ActiveBookings from '../pages/customer/ActiveBookings';
import BookingHistory from '../pages/customer/BookingHistory';
import SavedWorkers from '../pages/customer/SavedWorkers';
import CustomerSupport from '../pages/customer/CustomerSupport';
import CustomerProfile from '../pages/customer/CustomerProfile';
import CustomerSettings from '../pages/customer/CustomerSettings';
import CustomerPayments from '../pages/customer/CustomerPayments';
import CustomerMessages from '../pages/customer/CustomerMessages';
import CustomerNotifications from '../pages/customer/CustomerNotifications';
import CustomerReviews from '../pages/customer/CustomerReviews';
import WorkerReviews from '../pages/worker/WorkerReviews';
import ReviewGuidelines from '../pages/ReviewGuidelines';
import AdminReviewModeration from '../pages/admin/ReviewModeration';
import WorkerMessages from '../pages/worker/WorkerMessages';
import WorkerNotifications from '../pages/worker/WorkerNotifications';
import SupervisorMessages from '../pages/supervisor/SupervisorMessages';
import SupervisorNotifications from '../pages/supervisor/SupervisorNotifications';

// Admin Platform Management Suite (Phase 11)
import AdminRouteGuard from '../components/auth/AdminRouteGuard';
import AdminDashboardOverview from '../pages/admin/DashboardOverview';
import AdminUserManagement from '../pages/admin/UserManagement';
import AdminWorkerManagement from '../pages/admin/WorkerManagement';
import AdminVerificationManagement from '../pages/admin/VerificationManagement';
import AdminSupervisorManagement from '../pages/admin/SupervisorManagement';
import AdminServiceManagement from '../pages/admin/ServiceManagement';
import AdminBookingManagement from '../pages/admin/BookingManagement';
import AdminProjectManagement from '../pages/admin/ProjectManagement';
import AdminPaymentManagement from '../pages/admin/PaymentManagement';
import AdminSupportManagement from '../pages/admin/SupportManagement';
import AdminPlatformSettings from '../pages/admin/PlatformSettings';
import AdminAuditLogs from '../pages/admin/AuditLogs';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Core Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/book" element={<BookService />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/review-guidelines" element={<ReviewGuidelines />} />
        <Route path="/contractors" element={<Contractors />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Authentication Routes */}
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Onboarding Routes */}
        <Route path="/worker/join" element={<WorkerJoin />} />
        <Route path="/worker/onboarding" element={<WorkerOnboarding />} />
        <Route path="/supervisor/onboarding" element={<SupervisorOnboarding />} />

        {/* Customer Dashboard Suite (Protected) */}
        <Route path="/customer" element={<Navigate to="/customer/dashboard" replace />} />
        <Route 
          path="/customer/dashboard" 
          element={<CustomerRouteGuard><DashboardOverview /></CustomerRouteGuard>} 
        />
        <Route 
          path="/customer/services" 
          element={<CustomerRouteGuard><BrowseServices /></CustomerRouteGuard>} 
        />
        <Route 
          path="/customer/services/:serviceId" 
          element={<CustomerRouteGuard><ServiceDetail /></CustomerRouteGuard>} 
        />
        <Route 
          path="/customer/workers" 
          element={<CustomerRouteGuard><WorkerDiscovery /></CustomerRouteGuard>} 
        />
        <Route 
          path="/customer/book" 
          element={<CustomerRouteGuard><CustomerBook /></CustomerRouteGuard>} 
        />
        <Route 
          path="/customer/bookings" 
          element={<CustomerRouteGuard><BookingsOverview /></CustomerRouteGuard>} 
        />
        <Route 
          path="/customer/bookings/active" 
          element={<CustomerRouteGuard><ActiveBookings /></CustomerRouteGuard>} 
        />
        <Route 
          path="/customer/bookings/history" 
          element={<CustomerRouteGuard><BookingHistory /></CustomerRouteGuard>} 
        />
        <Route 
          path="/customer/saved-workers" 
          element={<CustomerRouteGuard><SavedWorkers /></CustomerRouteGuard>} 
        />
        <Route 
          path="/customer/reviews" 
          element={<CustomerRouteGuard><CustomerReviews /></CustomerRouteGuard>} 
        />
        <Route 
          path="/customer/support" 
          element={<CustomerRouteGuard><CustomerSupport /></CustomerRouteGuard>} 
        />
        <Route 
          path="/customer/profile" 
          element={<CustomerRouteGuard><CustomerProfile /></CustomerRouteGuard>} 
        />
        <Route 
          path="/customer/settings" 
          element={<CustomerRouteGuard><CustomerSettings /></CustomerRouteGuard>} 
        />
        <Route 
          path="/customer/payments" 
          element={<CustomerRouteGuard><CustomerPayments /></CustomerRouteGuard>} 
        />
        <Route 
          path="/customer/messages" 
          element={<CustomerRouteGuard><CustomerMessages /></CustomerRouteGuard>} 
        />
        <Route 
          path="/customer/notifications" 
          element={<CustomerRouteGuard><CustomerNotifications /></CustomerRouteGuard>} 
        />

        {/* Worker Dashboard Suite (Protected) */}
        <Route path="/worker" element={<Navigate to="/worker/dashboard" replace />} />
        <Route 
          path="/worker/dashboard" 
          element={<WorkerRouteGuard><WorkerDashboardOverview /></WorkerRouteGuard>} 
        />
        <Route 
          path="/worker/profile" 
          element={<WorkerRouteGuard><WorkerProfile /></WorkerRouteGuard>} 
        />
        <Route 
          path="/worker/skills" 
          element={<WorkerRouteGuard><WorkerSkills /></WorkerRouteGuard>} 
        />
        <Route 
          path="/worker/find-work" 
          element={<WorkerRouteGuard><FindWork /></WorkerRouteGuard>} 
        />
        <Route 
          path="/worker/requests" 
          element={<WorkerRouteGuard><JobRequests /></WorkerRouteGuard>} 
        />
        <Route 
          path="/worker/jobs/active" 
          element={<WorkerRouteGuard><ActiveJobs /></WorkerRouteGuard>} 
        />
        <Route 
          path="/worker/jobs/completed" 
          element={<WorkerRouteGuard><CompletedJobs /></WorkerRouteGuard>} 
        />
        <Route 
          path="/worker/reviews" 
          element={<WorkerRouteGuard><WorkerReviews /></WorkerRouteGuard>} 
        />
        <Route 
          path="/worker/verification" 
          element={<WorkerRouteGuard><WorkerVerification /></WorkerRouteGuard>} 
        />
        <Route 
          path="/worker/id-card" 
          element={<WorkerRouteGuard><WorkerIdCard /></WorkerRouteGuard>} 
        />
        <Route 
          path="/worker/earnings" 
          element={<WorkerRouteGuard><WorkerEarnings /></WorkerRouteGuard>} 
        />
        <Route 
          path="/worker/payment-settings" 
          element={<WorkerRouteGuard><PaymentSettings /></WorkerRouteGuard>} 
        />
        <Route 
          path="/worker/support" 
          element={<WorkerRouteGuard><WorkerSupport /></WorkerRouteGuard>} 
        />
        <Route 
          path="/worker/settings" 
          element={<WorkerRouteGuard><WorkerSettings /></WorkerRouteGuard>} 
        />
        <Route 
          path="/worker/messages" 
          element={<WorkerRouteGuard><WorkerMessages /></WorkerRouteGuard>} 
        />
        <Route 
          path="/worker/notifications" 
          element={<WorkerRouteGuard><WorkerNotifications /></WorkerRouteGuard>} 
        />

        {/* Supervisor Dashboard Suite (Protected) */}
        <Route path="/supervisor" element={<Navigate to="/supervisor/dashboard" replace />} />
        <Route 
          path="/supervisor/dashboard" 
          element={<SupervisorRouteGuard><SupervisorDashboardOverview /></SupervisorRouteGuard>} 
        />
        <Route 
          path="/supervisor/profile" 
          element={<SupervisorRouteGuard><SupervisorProfile /></SupervisorRouteGuard>} 
        />
        <Route 
          path="/supervisor/workers" 
          element={<SupervisorRouteGuard><WorkerManagement /></SupervisorRouteGuard>} 
        />
        <Route 
          path="/supervisor/find-workers" 
          element={<SupervisorRouteGuard><FindWorkers /></SupervisorRouteGuard>} 
        />
        <Route 
          path="/supervisor/assignments" 
          element={<SupervisorRouteGuard><JobAssignments /></SupervisorRouteGuard>} 
        />
        <Route 
          path="/supervisor/projects" 
          element={<SupervisorRouteGuard><SupervisorProjects /></SupervisorRouteGuard>} 
        />
        <Route 
          path="/supervisor/projects/:projectId" 
          element={<SupervisorRouteGuard><ProjectDetail /></SupervisorRouteGuard>} 
        />
        <Route 
          path="/supervisor/progress" 
          element={<SupervisorRouteGuard><ProjectProgress /></SupervisorRouteGuard>} 
        />
        <Route 
          path="/supervisor/requests" 
          element={<SupervisorRouteGuard><CustomerRequests /></SupervisorRouteGuard>} 
        />
        <Route 
          path="/supervisor/payments" 
          element={<SupervisorRouteGuard><SupervisorPayments /></SupervisorRouteGuard>} 
        />
        <Route 
          path="/supervisor/reports" 
          element={<SupervisorRouteGuard><Reports /></SupervisorRouteGuard>} 
        />
        <Route 
          path="/supervisor/support" 
          element={<SupervisorRouteGuard><SupervisorSupport /></SupervisorRouteGuard>} 
        />
        <Route 
          path="/supervisor/settings" 
          element={<SupervisorRouteGuard><SupervisorSettings /></SupervisorRouteGuard>} 
        />
        <Route 
          path="/supervisor/messages" 
          element={<SupervisorRouteGuard><SupervisorMessages /></SupervisorRouteGuard>} 
        />
        <Route 
          path="/supervisor/notifications" 
          element={<SupervisorRouteGuard><SupervisorNotifications /></SupervisorRouteGuard>} 
        />

        {/* Admin Platform Management Suite (Protected) */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route 
          path="/admin/dashboard" 
          element={<AdminRouteGuard><AdminDashboardOverview /></AdminRouteGuard>} 
        />
        <Route 
          path="/admin/users" 
          element={<AdminRouteGuard><AdminUserManagement /></AdminRouteGuard>} 
        />
        <Route 
          path="/admin/workers" 
          element={<AdminRouteGuard><AdminWorkerManagement /></AdminRouteGuard>} 
        />
        <Route 
          path="/admin/verifications" 
          element={<AdminRouteGuard><AdminVerificationManagement /></AdminRouteGuard>} 
        />
        <Route 
          path="/admin/supervisors" 
          element={<AdminRouteGuard><AdminSupervisorManagement /></AdminRouteGuard>} 
        />
        <Route 
          path="/admin/services" 
          element={<AdminRouteGuard><AdminServiceManagement /></AdminRouteGuard>} 
        />
        <Route 
          path="/admin/bookings" 
          element={<AdminRouteGuard><AdminBookingManagement /></AdminRouteGuard>} 
        />
        <Route 
          path="/admin/projects" 
          element={<AdminRouteGuard><AdminProjectManagement /></AdminRouteGuard>} 
        />
        <Route 
          path="/admin/payments" 
          element={<AdminRouteGuard><AdminPaymentManagement /></AdminRouteGuard>} 
        />
        <Route 
          path="/admin/reviews" 
          element={<AdminRouteGuard><AdminReviewModeration /></AdminRouteGuard>} 
        />
        <Route 
          path="/admin/support" 
          element={<AdminRouteGuard><AdminSupportManagement /></AdminRouteGuard>} 
        />
        <Route 
          path="/admin/settings" 
          element={<AdminRouteGuard><AdminPlatformSettings /></AdminRouteGuard>} 
        />
        <Route 
          path="/admin/audit-logs" 
          element={<AdminRouteGuard><AdminAuditLogs /></AdminRouteGuard>} 
        />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

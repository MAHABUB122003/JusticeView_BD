import { Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './components/public/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import Dashboard from './components/dashboard/Dashboard';
import Profile from './components/dashboard/Profile';
import Settings from './components/dashboard/Settings';
import ArrestEntry from './components/police/ArrestEntry';
import CaseEntry from './components/police/CaseEntry';
import MyArrests from './components/police/MyArrests';
import ChargeSheetEntry from './components/police/ChargeSheetEntry';
import EvidenceManagement from './components/police/EvidenceManagement';
import BailEntry from './components/court/BailEntry';
import CaseList from './components/court/CaseList';
import JudgmentEntry from './components/court/JudgmentEntry';
import PunishmentRecord from './components/court/PunishmentRecord';
import HearingEntry from './components/court/HearingEntry';
import UserManagement from './components/admin/UserManagement';
import DistrictManagement from './components/admin/DistrictManagement';
import ThanaManagement from './components/admin/ThanaManagement';
import CourtManagement from './components/admin/CourtManagement';
import AuditLogs from './components/admin/AuditLogs';
import SearchResults from './components/public/SearchResults';
import CriminalProfile from './components/public/CriminalProfile';
import CaseDetail from './components/public/CaseDetail';
import About from './components/public/About';
import Contact from './components/public/Contact';
import ImageSearch from './components/public/ImageSearch';
import { DirectoryHome, ProfessionalProfile, ProfessionalRegistration } from './components/directory';

export default function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/criminal/:id" element={<CriminalProfile />} />
        <Route path="/case/:id" element={<CaseDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/face-search" element={<ImageSearch />} />
        <Route path="/login" element={<Login />} />
        <Route path="/directory" element={<DirectoryHome />} />
        <Route path="/directory/register" element={<ProfessionalRegistration />} />
        <Route path="/directory/:id" element={<ProfessionalProfile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        <Route path="/police/arrest" element={<ProtectedRoute roles={['super_admin', 'admin', 'police_officer']}><ArrestEntry /></ProtectedRoute>} />
        <Route path="/police/case" element={<ProtectedRoute roles={['super_admin', 'admin', 'police_officer']}><CaseEntry /></ProtectedRoute>} />
        <Route path="/police/my-arrests" element={<ProtectedRoute roles={['super_admin', 'admin', 'police_officer']}><MyArrests /></ProtectedRoute>} />
        <Route path="/police/cases" element={<ProtectedRoute roles={['super_admin', 'admin', 'police_officer']}><CaseList /></ProtectedRoute>} />
        <Route path="/police/charge-sheet" element={<ProtectedRoute roles={['super_admin', 'admin', 'police_officer']}><ChargeSheetEntry /></ProtectedRoute>} />
        <Route path="/police/evidence" element={<ProtectedRoute roles={['super_admin', 'admin', 'police_officer']}><EvidenceManagement /></ProtectedRoute>} />

        <Route path="/court/bail" element={<ProtectedRoute roles={['super_admin', 'admin', 'court_clerk']}><BailEntry /></ProtectedRoute>} />
        <Route path="/court/cases" element={<ProtectedRoute roles={['super_admin', 'admin', 'court_clerk']}><CaseList /></ProtectedRoute>} />
        <Route path="/court/judgment" element={<ProtectedRoute roles={['super_admin', 'admin', 'court_clerk']}><JudgmentEntry /></ProtectedRoute>} />
        <Route path="/court/punishment" element={<ProtectedRoute roles={['super_admin', 'admin', 'court_clerk']}><PunishmentRecord /></ProtectedRoute>} />
        <Route path="/court/hearing" element={<ProtectedRoute roles={['super_admin', 'admin', 'court_clerk']}><HearingEntry /></ProtectedRoute>} />

        <Route path="/admin/users" element={<ProtectedRoute roles={['super_admin', 'admin']}><UserManagement /></ProtectedRoute>} />
        <Route path="/admin/districts" element={<ProtectedRoute roles={['super_admin', 'admin']}><DistrictManagement /></ProtectedRoute>} />
        <Route path="/admin/thanas" element={<ProtectedRoute roles={['super_admin', 'admin']}><ThanaManagement /></ProtectedRoute>} />
        <Route path="/admin/courts" element={<ProtectedRoute roles={['super_admin', 'admin']}><CourtManagement /></ProtectedRoute>} />
        <Route path="/admin/logs" element={<ProtectedRoute roles={['super_admin', 'admin']}><AuditLogs /></ProtectedRoute>} />
      </Routes>
    </Layout>
  );
}

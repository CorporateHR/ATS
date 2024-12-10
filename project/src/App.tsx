import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import { User, LogOut } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Dashboard from '@/pages/Dashboard';
import Jobs from '@/pages/Jobs';
import Clients from '@/pages/Clients';
import Team from '@/pages/Team';
import AllCandidates from '@/pages/candidates/AllCandidates';
import MyCandidates from '@/pages/candidates/MyCandidates';
import CandidateProfile from '@/pages/candidates/CandidateProfile';
import CandidateEdit from '@/pages/candidates/CandidateEdit';
import Masters from '@/pages/Masters';
import Settings from '@/pages/Settings';
import Unauthorized from '@/pages/Unauthorized';
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import AcceptInvitation from '@/pages/auth/AcceptInvitation';
import ProtectedRoute from '@/components/ProtectedRoute';
import RolesPage from '@/pages/RolesPage';
import LandingPage from '@/pages/Landing';
import UserProfile from '@/pages/UserProfile';
import { useAuthStore } from '@/store/auth';

function ProfileMenuWrapper() {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const handleProfileClick = () => {
    if (user?.id) {
      navigate(`/team/${user.id}`);
    } else {
      console.error('No user ID found');
      navigate('/login');
    }
  };

  return (
    <div className="fixed top-0 right-0 z-50 p-3 sm:p-4 mr-1 sm:mr-2">
      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center text-gray-600 hover:text-blue-600">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium hidden sm:inline">{user?.name || 'User'}</span>
          </div>
        </Menu.Button>
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white divide-y divide-gray-100 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleProfileClick}
                  className={`${
                    active ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                  } group flex rounded-md items-center w-full px-3 py-2 text-sm`}
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleSignOut}
                  className={`${
                    active ? 'bg-red-50 text-red-600' : 'text-gray-900'
                  } group flex rounded-md items-center w-full px-3 py-2 text-sm`}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Menu>
    </div>
  );
}

function App() {
  const { user, initialize, initialized } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  if (!initialized) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-1">
          {user && window.location.pathname !== '/' && <Navbar />}
          <div className="flex-1 min-h-full">
            {user && <ProfileMenuWrapper />}
            <div className="pt-12 sm:pt-14">
              <Routes>
                {/* Auth routes */}
                <Route path="/login" element={<div className="min-h-screen flex flex-col"><Login /><Footer /></div>} />
                <Route path="/signup" element={<div className="min-h-screen flex flex-col"><Signup /><Footer /></div>} />
                <Route path="/accept-invitation/:token" element={<div className="min-h-screen flex flex-col"><AcceptInvitation /><Footer /></div>} />
                <Route path="/" element={<div className="min-h-screen flex flex-col"><LandingPage /><Footer /></div>} />

                {/* Protected routes */}
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <div className="flex min-h-screen bg-gray-50 flex-col">
                        <main className="flex-1 ml-64 p-8 transition-all duration-300">
                          <div className="max-w-7xl mx-auto">
                            <Routes>
                              <Route path="/" element={<Dashboard />} />
                              <Route path="/dashboard" element={<Dashboard />} />
                              <Route
                                path="/jobs"
                                element={
                                  <ProtectedRoute allowedRoles={['admin', 'manager', 'recruiter']}>
                                    <Jobs />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/clients"
                                element={
                                  <ProtectedRoute allowedRoles={['admin', 'manager']}>
                                    <Clients />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/team"
                                element={
                                  <ProtectedRoute allowedRoles={['admin', 'manager']}>
                                    <Team />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/team/:id"
                                element={
                                  <ProtectedRoute allowedRoles={['admin', 'manager']}>
                                    <UserProfile />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/candidates/all"
                                element={
                                  <ProtectedRoute allowedRoles={['admin', 'manager', 'recruiter']}>
                                    <AllCandidates />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/candidates/my-candidates"
                                element={
                                  <ProtectedRoute allowedRoles={['admin', 'manager', 'recruiter']}>
                                    <MyCandidates />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/candidates/:id"
                                element={
                                  <ProtectedRoute allowedRoles={['admin', 'manager', 'recruiter']}>
                                    <CandidateProfile />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/candidates/:id/edit"
                                element={
                                  <ProtectedRoute allowedRoles={['admin', 'manager', 'recruiter']}>
                                    <CandidateEdit />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/masters"
                                element={
                                  <ProtectedRoute allowedRoles={['admin']}>
                                    <Masters />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/masters/roles"
                                element={
                                  <ProtectedRoute allowedRoles={['admin']}>
                                    <RolesPage />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/masters/settings"
                                element={
                                  <ProtectedRoute allowedRoles={['admin', 'manager']}>
                                    <Settings />
                                  </ProtectedRoute>
                                }
                              />
                              <Route path="/unauthorized" element={<Unauthorized />} />
                            </Routes>
                          </div>
                        </main>
                      </div>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

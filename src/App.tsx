import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import LeadForm from './components/LeadForm';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { useAuth } from './hooks/useAuth';

type AppView = 'landing' | 'leadForm' | 'adminLogin' | 'adminDashboard';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const { isAuthenticated, login, logout } = useAuth();

  const handleShowLeadForm = () => setCurrentView('leadForm');
  const handleCloseLeadForm = () => setCurrentView('landing');
  
  const handleShowAdminLogin = () => setCurrentView('adminLogin');
  const handleAdminLogin = () => {
    login();
    setCurrentView('adminDashboard');
  };
  
  const handleAdminLogout = () => {
    logout();
    setCurrentView('landing');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'leadForm':
        return <LeadForm onClose={handleCloseLeadForm} />;
      
      case 'adminLogin':
        return (
          <AdminLogin
            onLogin={handleAdminLogin}
            onBack={() => setCurrentView('landing')}
          />
        );
      
      case 'adminDashboard':
        return isAuthenticated ? (
          <AdminDashboard onLogout={handleAdminLogout} />
        ) : (
          <AdminLogin
            onLogin={handleAdminLogin}
            onBack={() => setCurrentView('landing')}
          />
        );
      
      default:
        return (
          <div className="relative">
            <LandingPage onShowLeadForm={handleShowLeadForm} />
            
            {/* Admin Access Button */}
            <button
              onClick={handleShowAdminLogin}
              className="fixed bottom-6 right-6 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-300 text-sm font-medium shadow-lg z-40"
            >
              Admin Access
            </button>
          </div>
        );
    }
  };

  return <div className="font-sans">{renderCurrentView()}</div>;
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Utilisateurs from './pages/Utilisateurs';
import Reglements from './pages/Reglements';
import Rapports from './pages/Rapports';
import Emails from './pages/Emails';
import EmailsEnvoyes from './pages/EmailsEnvoyes';
import Chatbot from './pages/Chatbot';
import PromptEdit from './pages/PromptEdit';
import Login from './pages/login.jsx';

// ✅ Créer un wrapper pour utiliser useLocation en dehors de <Router>
const AppContent = () => {
  const location = useLocation();
  const hideSidebarRoutes = ['/']; // cacher Sidebar sur page login
  const showSidebar = !hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {showSidebar && <Sidebar />}

      <div
        className="flex-grow-1 p-4"
        style={{
          marginLeft: showSidebar ? '250px' : '0',
          backgroundColor: '#f8f9fa',
          width: '100%',
        }}
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/utilisateurs" element={<Utilisateurs />} />
          <Route path="/reglements" element={<Reglements />} />
          <Route path="/rapports" element={<Rapports />} />
          <Route path="/emails" element={<Emails />} />
          <Route path="/emails-envoyes" element={<EmailsEnvoyes />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/prompt" element={<PromptEdit />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

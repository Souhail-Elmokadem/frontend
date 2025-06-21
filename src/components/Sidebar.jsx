import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import laprophanLogo from '../assets/Laprophane.png';

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userName = user?.name || '';
  const userEmail = user?.email || '';
  const role = user?.role || '';

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-tachometer-alt', roles: ['admin', 'utilisateur'] },
    { name: 'Utilisateurs', path: '/utilisateurs', icon: 'fas fa-users-cog', roles: ['admin'] },
    { name: 'Règlementaires', path: '/reglements', icon: 'fas fa-book', roles: ['admin', 'utilisateur'] },
    { name: 'Rapports', path: '/rapports', icon: 'fas fa-file-alt', roles: ['admin'] },
    { name: 'Emails', path: '/emails', icon: 'fas fa-envelope', roles: ['admin'] },
    { name: 'Emails Envoyés', path: '/emails-envoyes', icon: 'fas fa-paper-plane', roles: ['admin', 'utilisateur'] },
    { name: 'Assistant AI', path: '/chatbot', icon: 'fas fa-robot', roles: ['admin', 'utilisateur'] },
    { name: 'Prompt Edit', path: '/prompt', icon: 'fas fa-edit', roles: ['admin', 'utilisateur'] }
  ];

  const sidebarStyle = {
    backgroundColor: '#2d8d2d',
    width: '250px'
  };

  const activeLinkStyle = {
    backgroundColor: '#226b22',
    borderRadius: '5px'
  };

  return (
    <div className="d-flex flex-column justify-content-between vh-100 p-3 position-fixed" style={sidebarStyle}>
      <div>
        {/* Logo et titre */}
        <div className="text-center mb-4">
          <img
            src={laprophanLogo}
            alt="LAPROPHAN Logo"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              objectFit: 'cover',
              marginBottom: '10px',
              border: '3px solid white'
            }}
          />
          <h4 className="text-white">LAPROPHAN</h4>
        </div>

        {/* Liens du menu */}
        <ul className="nav flex-column">
          {links
            .filter(link => link.roles.includes(role))
            .map(link => (
              <li key={link.name} className="nav-item mb-2">
                <NavLink
                  to={link.path}
                  className="nav-link text-white"
                  style={({ isActive }) => (isActive ? activeLinkStyle : {})}
                >
                  <i className={`${link.icon} me-2`}></i> {link.name}
                </NavLink>
              </li>
            ))}
        </ul>
      </div>

      {/* Profil + logout */}
      <div className="mt-4 border-top pt-3 d-flex justify-content-between align-items-start text-white">
        <div>
          <div className="fw-bold">{userName}</div>
          <div className="small text-white-50">{userEmail}</div>
          <div className="small text-white-50 fst-italic">{role}</div>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-sm btn-outline-light"
          title="Déconnexion"
        >
          <i className="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

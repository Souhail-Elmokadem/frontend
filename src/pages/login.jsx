import React, { useState } from 'react';
import axios from 'axios';
import laprophanLogo from '../assets/Laprophane.png';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Identifiants invalides');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#f8f9fa' }}>
      
      <header className="py-4 shadow-sm" style={{ backgroundColor: '#2d8d2d' }}>
        <div className="container text-center">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
            <img
              src={laprophanLogo}
              alt="LAPROPHAN Logo"
              className="img-fluid rounded-circle border border-4 border-white"
              style={{
                width: '90px',
                height: '90px',
                objectFit: 'contain',
                backgroundColor: 'white',
              }}
            />
          </motion.div>
          <h1 className="mt-3 text-white fw-light">LAPROPHAN</h1>
          <p className="text-white-50 mb-0">Plateforme professionnelle</p>
        </div>
      </header>

      <main className="flex-grow-1 d-flex align-items-center py-5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="row justify-content-center"
          >
            <div className="col-md-6 col-lg-4">
              <div className="card border-0 shadow-lg rounded-3 overflow-hidden">
               
                <div className="card-header text-white py-3" style={{ backgroundColor: '#2d8d2d' }}>
                  <h4 className="mb-0 text-center">Connexion</h4>
                </div>

                <div className="card-body p-4">
                  {error && (
                    <div className="alert alert-danger alert-dismissible fade show">
                      {error}
                      <button type="button" className="btn-close" onClick={() => setError('')} />
                    </div>
                  )}

                  <form onSubmit={handleLogin}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label text-muted small">
                        Adresse email
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="form-control form-control-lg"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="votre@email.com"
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="password" className="form-label text-muted small">
                        Mot de passe
                      </label>
                      <input
                        id="password"
                        type="password"
                        className="form-control form-control-lg"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                      />
                    </div>

                   
                    <div className="d-grid mb-3">
                      <motion.button
                        type="submit"
                        className="btn btn-lg text-white"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ backgroundColor: '#2d8d2d' }}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                            Connexion en cours...
                          </>
                        ) : (
                          'Se connecter'
                        )}
                      </motion.button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="text-center mt-4 text-muted small">
                © {new Date().getFullYear()} LAPROPHAN - Tous droits réservés
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Login;

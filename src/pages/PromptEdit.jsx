import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiSave, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { FaMagic } from 'react-icons/fa';

const PromptEdit = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/prompt-global`);
        setPrompt(res.data.prompt || '');
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement du prompt global.");
      }
    };
    fetchPrompt();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await axios.post(`http://localhost:8000/api/prompt-global`, { prompt });
      setMessage("✅ Prompt global enregistré avec succès.");
      setTimeout(() => navigate("/reglements"), 1500);
    } catch (err) {
      setError("❌ Erreur lors de l'enregistrement.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: '900px' }}>
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-0 py-3">
          <h3 className="mb-0 d-flex align-items-center text-success">
            <FaMagic className="me-2" />
            Modifier le prompt global
            {loading && (
              <span
                className="spinner-border spinner-border-sm ms-2 text-success"
                role="status"
                aria-hidden="true"
              ></span>
            )}
          </h3>
        </div>

        <div className="card-body">
          {message && (
            <div className="alert alert-success d-flex align-items-center shadow-sm mb-4">
              <FiCheckCircle className="me-2" /> {message}
            </div>
          )}
          {error && (
            <div className="alert alert-danger d-flex align-items-center shadow-sm mb-4">
              <FiAlertCircle className="me-2" /> {error}
            </div>
          )}

          <div className="mb-4">
            <label className="form-label fw-semibold">Prompt global</label>
            <textarea
              className="form-control shadow-sm"
              rows={12}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
              placeholder="Entrez ici le prompt global à utiliser pour générer les rapports réglementaires..."
            />
          </div>

          <div className="text-end">
            <button
              className="btn btn-success d-flex align-items-center"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Enregistrement...
                </>
              ) : (
                <>
                  <FiSave className="me-2" />
                  Valider
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptEdit;

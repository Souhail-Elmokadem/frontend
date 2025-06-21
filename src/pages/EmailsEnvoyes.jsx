import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiMail, FiClock, FiX } from 'react-icons/fi';

const EmailsEnvoyes = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://localhost:8000/api/emails_envoyes');
      setEmails(res.data);
    } catch (err) {
      setError("Erreur lors du chargement des emails envoyés");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const formatDate = (dateStr) => {
    const options = {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    };
    return new Date(dateStr).toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="container py-4" style={{ maxWidth: 1200 }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 d-flex align-items-center">
          <FiMail className="me-2" size={28} />
          <span>Historique des Emails Envoyés</span>
        </h2>
      </div>

      {/* Alertes */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center shadow-sm mb-4" role="alert">
          <FiX className="flex-shrink-0 me-2" size={20} />
          <div>{error}</div>
        </div>
      )}

      {/* Table des emails */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          {loading && emails.length === 0 ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
              <p className="mt-2">Chargement des emails envoyés...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Email</th>
                    <th className="text-center">Sujet</th>
                    <th>Date d'envoi</th>
                  </tr>
                </thead>
                <tbody>
                  {emails.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center text-muted py-4">
                        Aucun email envoyé pour le moment
                      </td>
                    </tr>
                  ) : (
                    emails.map(e => (
                      <tr key={e.id}>
                        <td className="align-middle">
                          <a href={`mailto:${e.email}`} className="text-decoration-none">{e.email}</a>
                        </td>
                        <td className="align-middle">{e.sujet}</td>
                        <td className="align-middle">
                          <div className="d-flex align-items-center">
                            <FiClock className="me-2 text-muted" size={14} />
                            {formatDate(e.date_envoi)}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailsEnvoyes;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiFileText, FiPlus, FiCheck, FiX } from 'react-icons/fi';
import { FaFilePdf } from 'react-icons/fa';

const Rapports = () => {
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://localhost:8000/api/rapports');
      setRapports(res.data);
    } catch (err) {
      setError('Erreur lors du chargement des rapports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const genererRapport = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post('http://localhost:8000/api/generer-rapport');
      setMessage('Rapport généré avec succès');
      await fetchData();
    } catch (err) {
      setError('Erreur lors de la génération du rapport');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = (id) => {
    window.open(`http://localhost:8000/api/rapports/pdf/${id}`, '_blank');
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container py-4" style={{ maxWidth: 1200 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 d-flex align-items-center">
          <FiFileText className="me-2" size={28} />
          <span>Rapports Envoyés</span>
        </h2>
        <button 
          onClick={genererRapport} 
          className="btn btn-outline-success d-flex align-items-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Génération...
            </>
          ) : (
            <>
              <FiPlus className="me-2" /> 
              Générer Rapport Manuellement
            </>
          )}
        </button>
      </div>

      {/* Alertes */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center shadow-sm mb-4" role="alert">
          <FiX className="flex-shrink-0 me-2" size={20} />
          <div>{error}</div>
        </div>
      )}
      {message && (
        <div className="alert alert-success d-flex align-items-center shadow-sm mb-4" role="alert">
          <FiCheck className="flex-shrink-0 me-2" size={20} />
          <div>{message}</div>
        </div>
      )}

      {/* Tableau des rapports */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          {loading && rapports.length === 0 ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
              <p className="mt-2">Chargement des rapports...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '20px' }} >ID</th>
                    <th className="text-center" style={{ width: '2002px' }}>Contenu</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rapports.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center text-muted py-4">
                        Aucun rapport disponible
                      </td>
                    </tr>
                  ) : (
                    rapports.map(r => (
                      <tr key={r.id}>
                        <td className="align-middle">{r.id}</td>
                        <td className="align-middle">
                          <div dangerouslySetInnerHTML={{ __html: r.contenu.slice(0, 110) + '...' }} />
                        </td>
                        <td className="align-middle text-center">
                          <button 
                            className="btn btn-outline-danger btn-sm d-flex align-items-center mx-auto"
                            onClick={() => downloadPDF(r.id)}
                          >
                            <FaFilePdf className="me-1" /> Download
                          </button>
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

export default Rapports;
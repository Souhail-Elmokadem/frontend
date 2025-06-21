import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Badge } from 'react-bootstrap';
import { FiFileText, FiCheck, FiX } from 'react-icons/fi';
import { FaFilePdf, FaMagic, FaFileAlt, FaRecycle } from 'react-icons/fa';

const Reglements = () => {
  const [reglements, setReglements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingId, setLoadingId] = useState(null);

  // Charger la liste des règlements
  const fetchReglements = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('https://scanlink.laprophan.com/api/reglements');
      setReglements(res.data);
    } catch (err) {
      setError('Erreur lors du chargement des règlements');
    } finally {
      setLoading(false);
    }
  };

  // Générer un rapport (1ère fois)
  const generateRapport = async (id) => {
    setLoadingId(id);
    setError(null);
    setMessage(null);
    try {
      await axios.post(`https://scanlink.laprophan.com/api/rapports/generer/${id}`);
      setMessage('✅ Rapport généré avec succès.');
      await fetchReglements();
    } catch (err) {
      setError('❌ Erreur lors de la génération du rapport.');
    } finally {
      setLoadingId(null);
    }
  };

  // Régénérer un rapport existant
  const regenerateRapport = async (reglementId) => {
    setLoadingId(reglementId);
    setMessage(null);
    try {
      await axios.post(`https://scanlink.laprophan.com/api/reglements/${reglementId}/regenere`);
      setMessage('✅ Rapport régénéré avec succès.');
      await fetchReglements();
    } catch (err) {
      setError('❌ Erreur lors de la régénération du rapport.');
    } finally {
      setLoadingId(null);
    }
  };

  const openHTML = (uuid) => {
    window.open(`https://scanlink.laprophan.com/rapports/html/${uuid}`, '_blank');
  };

  const downloadPDF = (id) => {
    window.open(`https://scanlink.laprophan.com/api/rapports/pdf/${id}`, '_blank');
  };

  useEffect(() => {
    fetchReglements();
  }, []);

  const filteredReglements = reglements.filter(reg =>
    reg.titre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-4" style={{ maxWidth: 1200 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 d-flex align-items-center">
          <FiFileText className="me-2" size={28} />
          <span>Textes Réglementaires</span>
        </h2>
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher un règlement..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: 300 }}
        />
      </div>

      {error && (
        <div className="alert alert-danger shadow-sm d-flex align-items-center" role="alert">
          <FiX className="me-2" /> {error}
        </div>
      )}
      {message && (
        <div className="alert alert-success shadow-sm d-flex align-items-center" role="alert">
          <FiCheck className="me-2" /> {message}
        </div>
      )}

      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0">Liste des Règlements</h5>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
              <p className="mt-2">Chargement des règlements...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Titre</th>
                    <th>Date de publication</th>
                    <th className="text-center">Statut</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReglements.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-4">
                        {searchTerm ? 'Aucun règlement trouvé' : 'Aucun règlement enregistré'}
                      </td>
                    </tr>
                  ) : (
                    filteredReglements.map(reg => (
                      <tr key={reg.id}>
                        <td className="align-middle fw-semibold">{reg.titre}</td>
                        <td className="align-middle">
                          {new Date(reg.date_publication).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="align-middle text-center">
                          {reg.rapport ? (
                            <Badge bg="success" className="px-3 py-1 rounded-pill">
                              <FiCheck className="me-1" /> Disponible
                            </Badge>
                          ) : (
                            <Badge bg="secondary" className="px-3 py-1 rounded-pill">
                              <FiX className="me-1" /> En attente
                            </Badge>
                          )}
                        </td>
                        <td className="align-middle text-center">
                          {reg.rapport ? (
                            <div className="d-flex justify-content-center gap-2">
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => openHTML(reg.rapport.uuid)}
                              >
                                <FaFileAlt className="me-1" /> Ouvrir
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => downloadPDF(reg.rapport.id)}
                              >
                                <FaFilePdf className="me-1" /> PDF
                              </button>
                              <button
                                className="btn btn-warning btn-sm"
                                onClick={() => regenerateRapport(reg.id)}
                                disabled={loadingId === reg.id}
                              >
                                <FaRecycle className="me-1" /> Régénérer
                              </button>
                            </div>
                          ) : (
                            <button
                              className="btn btn-outline-warning btn-sm"
                              onClick={() => generateRapport(reg.id)}
                              disabled={loadingId === reg.id}
                            >
                              {loadingId === reg.id ? 'Génération...' : <><FaMagic className="me-1" /> Générer</>}
                            </button>
                          )}
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

export default Reglements;

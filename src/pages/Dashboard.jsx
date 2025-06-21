import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Badge } from 'react-bootstrap';
import { FaCheck, FaTimes, FaExternalLinkAlt } from 'react-icons/fa';

const CATEGORIES_STYLES = {
  "Autorisation de Mise sur le Marché (AMM)": "#0d6efd",
  "Pharmacovigilance": "#6610f2",
  "Contrôle Qualité (QC)": "#6f42c1",
  "Assurance Qualité (QA)": "#d63384",
  "Production et Fabrication": "#dc3545",
  "Affaires Réglementaires Internationales": "#fd7e14",
  "Affaires Médicales et Promotionnelles": "#ffc107",
  "Environnement, Hygiène et Sécurité (EHS)": "#20c997",
  "Formations et Compétences": "#0dcaf0",
  "Données Cliniques et Précliniques": "#64748B",
};

const Dashboard = () => {
  const [reglements, setReglements] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const reglementsResponse = await axios.get('https://scanlink.laprophan.com/api/reglements');
      setReglements(reglementsResponse.data);
      setFiltered(reglementsResponse.data);

      const categoriesResponse = await axios.get('https://scanlink.laprophan.com/api/categories');
      const fetchedCategories = categoriesResponse.data;

      const existingNames = fetchedCategories.map(cat => cat.nom);
      const mergedCategories = [...fetchedCategories];

      Object.keys(CATEGORIES_STYLES).forEach(nom => {
        if (!existingNames.includes(nom)) {
          mergedCategories.push({ id: nom, nom, couleur: CATEGORIES_STYLES[nom] });
        }
      });

      setCategories(mergedCategories);
      setLoading(false);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors du chargement des données');
      setLoading(false);
    }
  };

  const handleManualImport = async () => {
    try {
      const response = await axios.post('https://scanlink.laprophan.com/api/webhook/lancer');
      alert(response.data.message || 'Import déclenché avec succès');
      fetchData(); // Recharger les données après l'import
    } catch (error) {
      console.error('Erreur import:', error);
      alert('Echec du déclenchement de l\'import.');
    }
  };

  const filterByCategory = (catId) => {
    if (!catId) {
      setFiltered(reglements);
    } else {
      setFiltered(reglements.filter(r => r.categorie_id === catId || r.categorie_id === catId.toString()));
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setFiltered(reglements.filter(r => r.titre.toLowerCase().includes(term)));
  };

  const countToday = reglements.filter(r => {
    const regDate = new Date(r.created_at).toDateString();
    const today = new Date().toDateString();
    return regDate === today;
  }).length;

  const totalReglements = reglements.length;
  const categoriesCount = categories.length;

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-primary" /></div>;
  if (error) return <div className="container py-5"><div className="alert alert-danger">{error}</div></div>;

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold text-center">Dashboard</h2>

      {/* Statistiques */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card shadow border-0 bg-primary text-white rounded-4">
            <div className="card-body">
              <h5>Ajouts aujourd'hui</h5>
              <p className="display-6 fw-bold">{countToday}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card shadow border-0 bg-success text-white rounded-4">
            <div className="card-body">
              <h5>Total règlements</h5>
              <p className="display-6 fw-bold">{totalReglements}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card shadow border-0 bg-info text-white rounded-4">
            <div className="card-body">
              <h5>Catégories</h5>
              <p className="display-6 fw-bold">{categoriesCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton importer maintenant */}
      <div className="text-center mb-4">
        <button
          className="btn btn-outline-success px-4 py-2 shadow"
          onClick={handleManualImport}
        >
          🚀 Importer maintenant les textes réglementaires
        </button>
      </div>

      {/* Recherche */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control shadow-sm"
          placeholder="🔍 Rechercher par titre..."
          onChange={handleSearch}
        />
      </div>

      {/* Filtres par catégorie */}
      <div className="mb-4 d-flex flex-wrap gap-2">
        <button className="btn btn-outline-dark rounded-pill shadow-sm" onClick={() => filterByCategory(null)}>Toutes</button>
        {categories.map(cat => (
          <button
            key={cat.nom}
            className="btn rounded-pill text-white shadow-sm"
            style={{ backgroundColor: CATEGORIES_STYLES[cat.nom] || '#6c757d' }}
            onClick={() => filterByCategory(cat.id)}
          >
            {cat.nom}
          </button>
        ))}
      </div>

      {/* Tableau */}
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-body table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Titre</th>
                <th>Date publication</th>
                <th>Catégorie</th>
                <th className="text-center">Statut Rapport</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map(r => {
                  const category = categories.find(c => c.id === r.categorie_id || c.nom === r.categorie_id);
                  return (
                    <tr key={r.id}>
                      <td>{r.titre}</td>
                      <td>{new Date(r.date_publication).toLocaleDateString()}</td>
                      <td>
                        {category ? (
                          <span className="badge text-white" style={{ backgroundColor: category.couleur }}>
                            {category.nom}
                          </span>
                        ) : (
                          <span className="text-muted">Non classé</span>
                        )}
                      </td>
                      <td className="text-center">
                        {r.rapport ? (
                          <Badge bg="success" className="d-inline-flex align-items-center">
                            <FaCheck className="me-1" /> Disponible
                          </Badge>
                        ) : (
                          <Badge bg="secondary" className="d-inline-flex align-items-center">
                            <FaTimes className="me-1" /> En attente
                          </Badge>
                        )}
                      </td>
                      <td className="text-center">
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-primary d-inline-flex align-items-center"
                        >
                          <FaExternalLinkAlt className="me-1" /> Link
                        </a>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan="5" className="text-center text-muted">Aucun règlement trouvé</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiUserPlus, FiX, FiCheck, FiUsers } from 'react-icons/fi';

const Utilisateurs = () => {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [form, setForm] = useState({
    id: null,
    nom: '',
    email: '',
    mot_de_passe: '',
    role: 'utilisateur',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUtilisateurs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://localhost:8000/api/utilisateurs');
      setUtilisateurs(res.data);
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!form.nom.trim()) {
      setError('Le nom est obligatoire.');
      return;
    }

    if (!validateEmail(form.email)) {
      setError('Veuillez saisir un email valide.');
      return;
    }

    if (!form.id && form.mot_de_passe.trim().length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    const payload = {
      nom: form.nom.trim(),
      email: form.email.trim(),
      role: form.role,
    };
    
    if (!form.id) {
      payload.mot_de_passe = form.mot_de_passe;
    }

    setLoading(true);
    try {
      if (!form.id) {
        await axios.post('http://localhost:8000/api/utilisateurs', payload);
        setMessage('Utilisateur ajouté avec succès.');
      } else {
        await axios.put(`http://localhost:8000/api/utilisateurs/${form.id}`, payload);
        setMessage('Utilisateur modifié avec succès.');
      }
      resetForm();
      await fetchUtilisateurs();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Erreur lors de la sauvegarde.';
      setError(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      nom: '',
      email: '',
      mot_de_passe: '',
      role: 'utilisateur',
    });
  };

  const handleEdit = (user) => {
    setError(null);
    setMessage(null);
    setForm({
      id: user.id,
      nom: user.nom,
      email: user.email,
      mot_de_passe: '',
      role: user.role,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    setError(null);
    setMessage(null);
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:8000/api/utilisateurs/${id}`);
        setMessage('Utilisateur supprimé avec succès.');
        await fetchUtilisateurs();
      } catch (err) {
        setError('Erreur lors de la suppression. L\'utilisateur est peut-être lié à d\'autres données.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };
  
  const filteredUsers = utilisateurs.filter(user => 
    user.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role) => {
    const roleClasses = {
      admin: 'bg-danger text-white',
      utilisateur: 'bg-primary text-white',
      // Ajoutez d'autres rôles si nécessaire
    };
    
    return (
      <span className={`badge ${roleClasses[role] || 'bg-secondary'} rounded-pill px-3 py-1`}>
        {role}
      </span>
    );
  };

  return (
    <div className="container py-4" style={{ maxWidth: 1200 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 d-flex align-items-center">
          <FiUsers className="me-2" size={28} />
          <span>Gestion des Utilisateurs</span>
        </h2>
        <div className="d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ minWidth: 250 }}
          />
        </div>
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

      {/* Formulaire */}
      <div className="card shadow-sm mb-5 border-0">
        <div className="card-header bg-white border-0 py-3">
          <h5 className="mb-0 d-flex align-items-center">
            {form.id ? (
              <>
                <FiEdit2 className="me-2 text-warning" />
                <span>Modifier un Utilisateur</span>
              </>
            ) : (
              <>
                <FiUserPlus className="me-2 text-success" />
                <span>Ajouter un Nouvel Utilisateur</span>
              </>
            )}
          </h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="nom" className="form-label fw-semibold">
                  Nom complet <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="nom"
                  className="form-control"
                  placeholder="Nom Complet "
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  required
                  disabled={loading}
                  
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="email" className="form-label fw-semibold">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="Laprophan@gmail.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  disabled={loading}
                  autoComplete="off"
                />  
              </div>

              {!form.id && (
                <div className="col-md-6">
                  <label htmlFor="mot_de_passe" className="form-label fw-semibold">
                    Mot de passe <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    id="mot_de_passe"
                    className="form-control"
                    placeholder="••••••"
                    value={form.mot_de_passe}
                    onChange={(e) => setForm({ ...form, mot_de_passe: e.target.value })}
                    required
                    disabled={loading}
                    minLength={6}
                    autoComplete="new-password"
                  />
                  <small className="text-muted">Minimum 6 caractères</small>
                </div>
              )}

              <div className="col-md-6">
                <label htmlFor="role" className="form-label fw-semibold">
                  Rôle <span className="text-danger">*</span>
                </label>
                <select
                  id="role"
                  className="form-select"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  disabled={loading}
                  required
                >
                  <option value="utilisateur">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>

              <div className="col-12 d-flex align-items-center pt-2">
                <button
                  type="submit"
                  className={`btn ${form.id ? 'btn-warning' : 'btn-success'} d-flex align-items-center`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      {form.id ? 'Modification...' : 'Ajout en cours...'}
                    </>
                  ) : (
                    <>
                      {form.id ? (
                        <>
                          <FiEdit2 className="me-2" />
                          Mettre à jour
                        </>
                      ) : (
                        <>
                          <FiUserPlus className="me-2" />
                          Ajouter l'utilisateur
                        </>
                      )}
                    </>
                  )}
                </button>
                {form.id && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary ms-3 d-flex align-items-center"
                    onClick={resetForm}
                    disabled={loading}
                  >
                    <FiX className="me-2" />
                    Annuler
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-0 py-3">
          <h5 className="mb-0">Liste des Utilisateurs</h5>
        </div>
        <div className="card-body p-0">
          {loading && utilisateurs.length === 0 ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
              <p className="mt-2">Chargement des utilisateurs...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Utilisateur</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th className="text-center" style={{ width: '200px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-4">
                        {searchTerm ? 'Aucun utilisateur ne correspond à votre recherche' : 'Aucun utilisateur enregistré'}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="align-middle">
                          <div className="d-flex align-items-center">
                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 36, height: 36 }}>
                              {user.nom.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="fw-semibold">{user.nom}</div>
                              
                            </div>
                          </div>
                        </td>
                        <td className="align-middle">
                          <a href={`mailto:${user.email}`} className="text-decoration-none">
                            {user.email}
                          </a>
                        </td>
                        <td className="align-middle">
                          {getRoleBadge(user.role)}
                        </td>
                        <td className="align-middle text-end">
                          <button
                            className="btn btn-sm btn-outline-primary me-2 d-inline-flex align-items-center"
                            onClick={() => handleEdit(user)}
                            disabled={loading}
                          >
                            <FiEdit2 className="me-1" size={14} />
                            <span>Éditer</span>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger d-inline-flex align-items-center"
                            onClick={() => handleDelete(user.id)}
                            disabled={loading}
                          >
                            <FiTrash2 className="me-1" size={14} />
                            <span>Supprimer</span>
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

export default Utilisateurs;
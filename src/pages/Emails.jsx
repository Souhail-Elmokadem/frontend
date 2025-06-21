import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiMail, FiX, FiCheck, FiPlus } from 'react-icons/fi';

const Emails = () => {
  const [emails, setEmails] = useState([]);
  const [form, setForm] = useState({ 
    id: null, 
    name: '', 
    adresse: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchEmails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://localhost:8000/api/emails');
      setEmails(res.data);
    } catch (err) {
      setError('Erreur lors du chargement des emails.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!form.name.trim()) {
      setError('Le nom est obligatoire.');
      return;
    }

    if (!validateEmail(form.adresse)) {
      setError('Veuillez saisir un email valide.');
      return;
    }

    const payload = {
      name: form.name.trim(),
      adresse: form.adresse.trim(),
    };

    setLoading(true);
    try {
      if (!form.id) {
        await axios.post('http://localhost:8000/api/emails', payload);
        setMessage('Email ajouté avec succès.');
      } else {
        await axios.put(`http://localhost:8000/api/emails/${form.id}`, payload);
        setMessage('Email modifié avec succès.');
      }
      resetForm();
      await fetchEmails();
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
      name: '',
      adresse: '',
    });
  };

  const handleEdit = (email) => {
    setError(null);
    setMessage(null);
    setForm({
      id: email.id,
      name: email.name,
      adresse: email.adresse,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    setError(null);
    setMessage(null);
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet email ? Cette action est irréversible.')) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:8000/api/emails/${id}`);
        setMessage('Email supprimé avec succès.');
        await fetchEmails();
      } catch (err) {
        setError('Erreur lors de la suppression.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredEmails = emails.filter(email => 
    email.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    email.adresse.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-4" style={{ maxWidth: 1200 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 d-flex align-items-center">
          <FiMail className="me-2" size={28} />
          <span>Gestion des Emails</span>
        </h2>
        <div className="d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Rechercher un email..."
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
                <span>Modifier un Email</span>
              </>
            ) : (
              <>
                <FiPlus className="me-2 text-success" />
                <span>Ajouter un Nouvel Email</span>
              </>
            )}
          </h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="name" className="form-label fw-semibold">
                  Nom <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  placeholder="Nom du contact"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  disabled={loading}
                  autoComplete="off"
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="adresse" className="form-label fw-semibold">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  id="adresse"
                  className="form-control"
                  placeholder="Laprophan@gmail.com"
                  value={form.adresse}
                  onChange={(e) => setForm({ ...form, adresse: e.target.value })}
                  required
                  disabled={loading}
                  autoComplete="off"
                />
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
                          <FiPlus className="me-2" />
                          Ajouter l'email
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

      {/* Liste des emails */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white border-0 py-3">
          <h5 className="mb-0">Liste des Emails</h5>
        </div>
        <div className="card-body p-0">
          {loading && emails.length === 0 ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
              <p className="mt-2">Chargement des emails...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th className="text-center" style={{ width: '200px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmails.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center text-muted py-4">
                        {searchTerm ? 'Aucun email ne correspond à votre recherche' : 'Aucun email enregistré'}
                      </td>
                    </tr>
                  ) : (
                    filteredEmails.map((email) => (
                      <tr key={email.id}>
                        <td className="align-middle">
                          <div className="fw-semibold">{email.name}</div>
                        </td>
                        <td className="align-middle">
                          <a href={`mailto:${email.adresse}`} className="text-decoration-none">
                            {email.adresse}
                          </a>
                        </td>
                        <td className="align-middle text-center">
                          <div className="d-flex justify-content-center gap-2">
                            <button
                              className="btn btn-sm btn-outline-primary d-inline-flex align-items-center"
                              onClick={() => handleEdit(email)}
                              disabled={loading}
                            >
                              <FiEdit2 className="me-1" size={14} />
                              <span>Éditer</span>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger d-inline-flex align-items-center"
                              onClick={() => handleDelete(email.id)}
                              disabled={loading}
                            >
                              <FiTrash2 className="me-1" size={14} />
                              <span>Supprimer</span>
                            </button>
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

export default Emails;
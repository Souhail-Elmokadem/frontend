import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Intercepteur pour gérer les erreurs
instance.interceptors.response.use(
    response => response,
    error => {
        console.error('Erreur API:', error);
        return Promise.reject(error);
    }
);

export default instance; 
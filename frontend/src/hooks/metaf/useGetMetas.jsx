import { useState, useEffect } from 'react';
import { getAllMetas } from '../../services/metaf.service.js';
import { showErrorAlert } from '../../helpers/sweetAlert.js';

export default function useGetMetas() {
  const [metas, setMetas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMetas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllMetas();
      if (response.status === 'Success') {
        setMetas(response.data || []);
      } else {
        setError(response.message || 'Error al obtener las metas financieras');
        showErrorAlert('Error', response.message || 'Error al obtener las metas financieras');
      }
    } catch (error) {
      console.error('Error al obtener metas financieras:', error);
      setError(error.message);
      showErrorAlert('Error', 'Error al obtener las metas financieras');
    } finally {
      setLoading(false);
    }
  };

  const refreshMetas = () => {
    fetchMetas();
  };

  useEffect(() => {
    fetchMetas();
  }, []);

  return {
    metas,
    loading,
    error,
    refreshMetas
  };
} 
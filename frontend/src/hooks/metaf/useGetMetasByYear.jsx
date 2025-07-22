import { useState, useEffect } from 'react';
import { getMetasByYear } from '../../services/metaf.service.js';


export default function useGetMetasByYear(year) {
  const [metas, setMetas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMetasByYear = async (selectedYear) => {
    if (!selectedYear || selectedYear === 'all') {
      setMetas([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await getMetasByYear(selectedYear);
      
      if (response.status === 'Success') {
        setMetas(response.data || []);
      } else {
        setError(response.message || 'Error al obtener las metas financieras');
      }
    } catch (error) {
      console.error('Error al obtener metas financieras por año:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetasByYear(year);
  }, [year]);

  const refreshMetas = () => {
    fetchMetasByYear(year);
  };

  return {
    metas,
    loading,
    error,
    refreshMetas
  };
}
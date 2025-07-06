import { useState, useEffect } from 'react';
import { getMetasByYear } from '../../services/metaf.service.js';
import { showErrorAlert } from '../../helpers/sweetAlert.js';

export default function useGetMetasByYear(year) {
  const [metas, setMetas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMetasByYear = async (selectedYear) => {
    console.log('useGetMetasByYear - fetchMetasByYear called with year:', selectedYear);
    
    if (!selectedYear || selectedYear === 'all') {
      console.log('useGetMetasByYear - Setting metas to empty array');
      setMetas([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log('useGetMetasByYear - Calling API for year:', selectedYear);
      const response = await getMetasByYear(selectedYear);
      console.log('useGetMetasByYear - API response:', response);
      
      if (response.status === 'Success') {
        console.log('useGetMetasByYear - Setting metas:', response.data || []);
        setMetas(response.data || []);
      } else {
        console.log('useGetMetasByYear - Error response:', response.message);
        setError(response.message || 'Error al obtener las metas financieras');
        showErrorAlert('Error', response.message || 'Error al obtener las metas financieras');
      }
    } catch (error) {
      console.error('Error al obtener metas financieras por año:', error);
      setError(error.message);
      showErrorAlert('Error', 'Error al obtener las metas financieras');
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
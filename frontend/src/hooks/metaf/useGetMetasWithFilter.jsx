import { useState, useEffect } from 'react';
import { getAllMetas, getMetasByYear } from '../../services/metaf.service.js';
import { showErrorAlert } from '../../helpers/sweetAlert.js';

export default function useGetMetasWithFilter(selectedYear) {
  const [metas, setMetas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMetas = async (year) => {
    console.log('useGetMetasWithFilter - fetchMetas called with year:', year);
    
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (year === 'all') {
        console.log('useGetMetasWithFilter - Fetching all metas');
        response = await getAllMetas();
      } else {
        console.log('useGetMetasWithFilter - Fetching metas for year:', year);
        response = await getMetasByYear(year);
      }
      
      console.log('useGetMetasWithFilter - API response:', response);
      
      if (response.status === 'Success') {
        console.log('useGetMetasWithFilter - Setting metas:', response.data || []);
        setMetas(response.data || []);
      } else {
        console.log('useGetMetasWithFilter - Error response:', response.message);
        setError(response.message || 'Error al obtener las metas financieras');
        setMetas([]);
        
        // Solo mostrar alerta si es un error real, no si simplemente no hay datos
        if (response.message && !response.message.includes('No se encontraron')) {
          showErrorAlert('Error', response.message || 'Error al obtener las metas financieras');
        }
      }
    } catch (error) {
      console.error('useGetMetasWithFilter - Error:', error);
      setError(error.message);
      setMetas([]);
      showErrorAlert('Error', 'Error al obtener las metas financieras');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedYear !== null && selectedYear !== undefined) {
      fetchMetas(selectedYear);
    }
  }, [selectedYear]);

  const refreshMetas = () => {
    if (selectedYear !== null && selectedYear !== undefined) {
      fetchMetas(selectedYear);
    }
  };

  return {
    metas,
    loading,
    error,
    refreshMetas
  };
} 
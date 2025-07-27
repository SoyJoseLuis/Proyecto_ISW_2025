import { useState, useEffect } from 'react';
import { getAllMetas, getMetasByYear } from '../../services/metaf.service.js';
import { showErrorAlert } from '../../helpers/sweetAlert.js';

export default function useGetMetasWithFilter(selectedYear) {
  const [metas, setMetas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMetas = async (year) => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (year === 'all') {
        response = await getAllMetas();
      } else {
        response = await getMetasByYear(year);
      }
      
      if (response.status === 'Success') {
        setMetas(response.data || []);
      } else {
        // Identificar si es un error de "no hay datos" vs un error real
        const isNoDataError = response.message && (
          response.message.includes('Error obteniendo las metas financieras por año') ||
          response.message.includes('No se encontraron') ||
          response.message.includes('no hay metas') ||
          response.statusCode === 404
        );
        
        if (isNoDataError) {
          // Si es un error de "no hay datos", simplemente setear array vacío sin mostrar alerta
          setMetas([]);
          setError(null); // No establecer error para evitar mostrar estado de error
        } else {
          // Si es un error real, mostrar alerta
          setError(response.message || 'Error al obtener las metas financieras');
          setMetas([]);
          showErrorAlert('Error', response.message || 'Error al obtener las metas financieras');
        }
      }
    } catch (error) {
      console.log(error);
      
      setMetas([]);
      
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
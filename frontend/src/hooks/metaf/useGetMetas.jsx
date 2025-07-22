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
        // Identificar si es un error de "no hay datos" vs un error real
        const isNoDataError = response.message && (
          response.message.includes('Error obteniendo las metas financieras') ||
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
      console.error('useGetMetas - Error:', error);
      setError(error.message);
      setMetas([]);
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
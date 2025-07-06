import { useState, useEffect, useCallback } from 'react';
import { getCurrentBalance } from '../../services/balance.service.js';

export function useGetCurrentBalance(autoRefresh = true, refreshInterval = 30000) {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrentBalance = useCallback(async () => {
    try {
      setError(null);
      const response = await getCurrentBalance();
      
      if (response.status === 'Success') {
        setBalance(response.data);
      } else {
        setError(response.message || 'Error al obtener el balance');
      }
    } catch (err) {
      console.error('Error al obtener el balance actual:', err);
      setError('Error interno del servidor');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Cargar datos inicial
    fetchCurrentBalance();

    // Configurar actualización automática si está habilitada
    if (autoRefresh) {
      const interval = setInterval(fetchCurrentBalance, refreshInterval);
      
      // Limpiar intervalo cuando el componente se desmonte
      return () => clearInterval(interval);
    }
  }, [fetchCurrentBalance, autoRefresh, refreshInterval]);

  return {
    balance,
    loading,
    error,
    refetch: fetchCurrentBalance
  };
} 
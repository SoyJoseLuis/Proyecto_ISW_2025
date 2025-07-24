import { useState, useEffect, useCallback } from 'react';
import { getBalanceByPeriod } from '../../services/balance.service.js';

export function useGetBalancesByPeriod(periodo, autoRefresh = false, refreshInterval = 30000) {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBalanceByPeriod = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await getBalanceByPeriod(periodo);
      if (response.status === 'Success') {
        // Si response.data es un array, toma el primer elemento xd
        const balanceData = Array.isArray(response.data) ? response.data[0] : response.data;
        setBalance(balanceData);
      } else {
        setError(response.message || 'Error al obtener el balance del periodo');
      }
    } catch  {
      setError('Error interno del servidor');
    } finally {
      setLoading(false);
    }
  }, [periodo]);

  useEffect(() => {
    if (periodo) {
      fetchBalanceByPeriod();
      if (autoRefresh) {
        const interval = setInterval(fetchBalanceByPeriod, refreshInterval);
        return () => clearInterval(interval);
      }
    }
  }, [fetchBalanceByPeriod, periodo, autoRefresh, refreshInterval]);

  return {
    balance,
    loading,
    error,
    refetch: fetchBalanceByPeriod
  };
} 
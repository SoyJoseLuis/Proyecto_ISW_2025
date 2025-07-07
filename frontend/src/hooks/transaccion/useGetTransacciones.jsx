import { useState, useEffect } from 'react';
import { getTransacciones } from '../../services/transaccion.service.js';
import { showErrorAlert } from '../../helpers/sweetAlert.js';

export function useGetTransacciones() {
  const [transacciones, setTransacciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransacciones = async () => {
    setIsLoading(true);
    try {
      const response = await getTransacciones();
      
      if (response.status === 'Success') {
        // Mapear los datos para que coincidan con lo que espera la tabla
        const transaccionesMapeadas = response.data.map(transaccion => ({
          id: transaccion.idTransaccion,
          montoTransaccion: transaccion.montoTransaccion,
          fechaTransaccion: transaccion.fechaTransaccion,
          rutEstudiante: transaccion.rutEstudiante,
          nombreEstudiante: transaccion.estudiante?.nombreEstudiante || '',
          idTipoTransaccion: transaccion.idTipoTransaccion,
          tipoTransaccionDescripcion: transaccion.tipoTransaccion?.descripcionTransaccion || '',
          motivoTransaccion: transaccion.motivoTransaccion,
          idActividad: transaccion.idActividad,
          idBalance: transaccion.idBalance
        }));
        setTransacciones(transaccionesMapeadas);
      } else {
        showErrorAlert('Error', response.message || 'Error al cargar las transacciones');
        setTransacciones([]);
      }
    } catch (error) {
      showErrorAlert('Error', error.message || 'Error al cargar las transacciones');
      setTransacciones([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransacciones();
  }, []);

  return {
    transacciones,
    isLoading,
    refetch: fetchTransacciones
  };
} 
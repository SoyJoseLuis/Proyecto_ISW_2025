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
          fechaCreacion: transaccion.fechaCreacion, // Campo necesario para validar eliminación
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
        // Identificar si es un error de "no hay datos" vs un error real
        const isNoDataError = response.message && (
          response.message.includes('No hay transacciones') ||
          response.message.includes('No se encontraron transacciones') ||
          response.message.includes('Error obteniendo las transacciones') ||
          response.statusCode === 404
        );
        
        if (isNoDataError) {
          // Si es un error de "no hay datos", simplemente setear array vacío sin mostrar alerta
          setTransacciones([]);
        } else {
          // Si es un error real, mostrar alerta
          showErrorAlert('Error', response.message || 'Error al cargar las transacciones');
          setTransacciones([]);
        }
      }
    } catch (error) {
      console.log(error);
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
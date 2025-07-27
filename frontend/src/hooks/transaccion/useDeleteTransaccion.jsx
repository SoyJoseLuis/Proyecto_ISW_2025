import { useState } from 'react';
import { deleteTransaccion } from '../../services/transaccion.service.js';
import { showSuccessAlert, showErrorAlert } from '../../helpers/sweetAlert.js';

export function useDeleteTransaccion() {
  const [isLoading, setIsLoading] = useState(false);

  const deleteTransaccionHandler = async (transaccion) => { // 
    console.log('ELIMINANDO TRANSACCIÓN:', {
      id: transaccion.id,
      tipo: transaccion.idTipoTransaccion,
      tipoDescripcion: transaccion.tipoTransaccionDescripcion,
      monto: transaccion.montoTransaccion
    });
    
    setIsLoading(true);
    try {
      const response = await deleteTransaccion(transaccion.id); // Usar solo el ID para la API
      
      if (response.status === 'Success') {
        showSuccessAlert('¡Éxito!', 'Transacción eliminada correctamente');
        return response.data;
      } else {
        showErrorAlert('Error', response.message || 'Error al eliminar la transacción');
        throw new Error(response.message);
      }
    } catch (error) {
      showErrorAlert('Error', error.message || 'Error al eliminar la transacción');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteTransaccion: deleteTransaccionHandler,
    isLoading
  };
} 
import { useState } from 'react';
import { deleteTransaccion } from '../../services/transaccion.service.js';
import { showSuccessAlert, showErrorAlert } from '../../helpers/sweetAlert.js';

export function useDeleteTransaccion() {
  const [isLoading, setIsLoading] = useState(false);

  const deleteTransaccionHandler = async (id) => {
    setIsLoading(true);
    try {
      const response = await deleteTransaccion(id);
      
      if (response.state === 'Success') {
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
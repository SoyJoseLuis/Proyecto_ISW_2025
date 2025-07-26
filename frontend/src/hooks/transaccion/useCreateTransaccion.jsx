import { useState } from 'react';
import { createTransaccion } from '../../services/transaccion.service.js';
import { showSuccessAlert, showErrorAlert } from '../../helpers/sweetAlert.js';

export function useCreateTransaccion() {
  const [isLoading, setIsLoading] = useState(false);

  const createTransaccionHandler = async (transaccionData) => {
    setIsLoading(true);
    try {
      // Asegurarse que el motivo vaya en mayúsculas
      const dataToSend = {
        ...transaccionData,
        motivoTransaccion: transaccionData.motivoTransaccion?.toUpperCase() || ''
      };
      const response = await createTransaccion(dataToSend);
      
      if (response.status === 'Success') {
        showSuccessAlert('¡Éxito!', 'Transacción creada correctamente');
        return response.data;
      } else {
        showErrorAlert('Error', response.message || 'Error al crear la transacción');
        throw new Error(response.message);
      }
    } catch (error) {
      showErrorAlert('Error', error.message || 'Error al crear la transacción');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createTransaccion: createTransaccionHandler,
    isLoading
  };
} 
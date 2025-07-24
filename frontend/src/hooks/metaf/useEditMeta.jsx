import { useState } from 'react';
import { updateMeta } from '../../services/metaf.service.js';
import { showErrorAlert, showSuccessAlert } from '../../helpers/sweetAlert.js';

export default function useEditMeta() {
  const [loading, setLoading] = useState(false);
// al final no se ocupa o igual si 
  const handleUpdateMeta = async (id, data) => {
    setLoading(true);
    try {
      const response = await updateMeta(id, data);
      if (response.status === 'Success') {
        showSuccessAlert('Meta actualizada', 'La meta financiera se ha actualizado exitosamente.');
        return { success: true, data: response };
      } else {
        showErrorAlert('Error', response.message || 'Error al actualizar la meta financiera');
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Error al actualizar meta financiera:', error);
      showErrorAlert('Error', 'Error al actualizar la meta financiera');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleUpdateMeta
  };
} 
import { useState } from 'react';
import { deleteMeta } from '../../services/metaf.service.js';
import { showErrorAlert, showSuccessAlert, showConfirmationAlert } from '../../helpers/sweetAlert.js';

export default function useDeleteMeta() {
  const [loading, setLoading] = useState(false);

  const handleDeleteMeta = async (id, metaName = 'la meta financiera') => {
    const isConfirmed = await showConfirmationAlert(
      '¿Estás seguro?',
      `¿Deseas eliminar ${metaName}? Esta acción no se puede deshacer.`
    );

    if (!isConfirmed) return { success: false, cancelled: true };

    setLoading(true);
    try {
      const response = await deleteMeta(Number(id));
      if (response.status === 'Success') {
        showSuccessAlert('¡Meta eliminada!', 'La meta financiera se ha eliminado exitosamente.');
        return { success: true, data: response };
      } else {
        showErrorAlert('Error', response.message || 'Error al eliminar la meta financiera');
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Error al eliminar meta financiera:', error);
      showErrorAlert('Error', 'Error al eliminar la meta financiera');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleDeleteMeta
  };
} 
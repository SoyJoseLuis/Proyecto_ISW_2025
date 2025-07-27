import { useState } from 'react';
import { createMeta } from '../../services/metaf.service.js';
import { showErrorAlert, showSuccessAlert } from '../../helpers/sweetAlert.js';
import { normalizarTitulo } from '../NormalizadorTitulo/useNormalizador.js';

export default function useCreateMeta(onSuccess) {
  const [loading, setLoading] = useState(false);

  const handleCreateMeta = async (data) => {
    setLoading(true);
    try {
      // Normalizar descripcionMeta y motivoMeta si existen
      const dataToSend = {
        ...data,
        ...(data.descripcionMeta && { descripcionMeta: normalizarTitulo(data.descripcionMeta) }),
        ...(data.motivoMeta && { motivoMeta: normalizarTitulo(data.motivoMeta) })
      };
      const response = await createMeta(dataToSend);
      if (response.status === 'Success') {
        showSuccessAlert('Meta financiera creada', 'La meta financiera se ha creado exitosamente.');
        
        // Llamar callback de éxito si existe
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess(response.data);
        }
        
        return { success: true, data: response };
      } else {
        showErrorAlert('Error', response.message || 'Error al crear la meta financiera');
        return { success: false, error: response.message };
      }
    } catch (error) {
      console.error('Error al crear meta financiera:', error);

      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleCreateMeta
  };
} 
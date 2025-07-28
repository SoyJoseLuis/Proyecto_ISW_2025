import { useState, useEffect } from 'react';
import * as actividadesService from '../../services/verActividades.service.js';

// Hook para obtener solo las actividades con estado "Archivada"
export function useVerHistorialAsistencia() {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);

  useEffect(() => {
    setLoading(true);
    actividadesService
      .listActividades()
      .then(all => {
        // Filtrar actividades con estado "Archivada"
        const archivadas = all.filter(a =>
          a.estadoActividad.descripcionEstadoActividad === 'Archivada'
        );
        setHistorial(archivadas);
      })
      .catch(err => {
        setError(err.response?.data?.error || err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return { historial, loading, error };
}

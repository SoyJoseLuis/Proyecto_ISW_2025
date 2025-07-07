import { useState, useEffect } from "react";
import * as actividadesService from "../../services/verActividades.service";

export function useVerActividades() {
  const [actividades, setActividades] = useState([]); //Mejorar, contiene el listado de en proceso
  const [loading, setLoading]         = useState(false); // Estado de carga
  const [error, setError]             = useState(null); //Guarda mensajes de error apra mostrarlos

  useEffect(() => {
    setLoading(true);
    actividadesService
      .listActividades()
      .then(all => {
              // 1) `all` es el array completo de la API
      // 2) Filtramos solo las que tienen estado “En proceso”
        
        const enProceso = all.filter(
          a => a.estadoActividad.descripcionEstadoActividad === "En proceso"
        );
        setActividades(enProceso);
      })
      .catch(err => setError(err.response?.data?.error || err.message))
      .finally(() => setLoading(false));
  }, []);

  return { actividades, loading, error };
}

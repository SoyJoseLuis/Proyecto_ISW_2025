import React, { useEffect, useState } from "react";
import { useVerActividades } from "../hooks/asistencia/useVerActividades";
import {
  generateToken,
  getCurrentToken
} from "../services/asistencia.service";
import "../styles/Asistencia.css";   // Asegúrate de importar tu css

export default function GenerarTokenTab() {
  const { actividades, loading, error } = useVerActividades();
  const [activeTokens, setActiveTokens] = useState({});

  // Al montar, intenta leer el token activo de cada actividad
  useEffect(() => {
    actividades.forEach(async (act) => {
      try {
        const code = await getCurrentToken(act.idActividad);
        setActiveTokens((prev) => ({ ...prev, [act.idActividad]: code }));
      } catch {
        // 404: no hay token activo → nada
      }
    });
  }, [actividades]);

  if (loading) return <p>Cargando actividades…</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="generar-token-container">
      {actividades.map((act) => {
        const token = activeTokens[act.idActividad];

        return (
          <div key={act.idActividad} className="actividad-card">
            <div className="actividad-info">
              <h3 className="actividad-titulo">{act.tituloActividad}</h3>
              <p className="actividad-descripcion">{act.descripcion}</p>
              <p className="actividad-fecha">
                {new Date(act.fechaActividad).toLocaleDateString()} ·{" "}
                {act.horaActividad}
              </p>
            </div>

            <button
              className="actividad-btn"
              onClick={async () => {
                if (!token) {
                  // Generar nuevo token
                  try {
                    const code = await generateToken(act.idActividad);
                    setActiveTokens((prev) => ({
                      ...prev,
                      [act.idActividad]: code,
                    }));
                  } catch (err) {
                    alert(err.response?.data?.error || err.message);
                  }
                } else {
                  // Mostrar token existente
                  alert(`Token: ${token}`);
                }
              }}
            >
              {token ? "👁️" : "+"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

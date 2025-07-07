import React, { useEffect } from "react";
import { useVerActividades }   from "../hooks/asistencia/useVerActividades"; //Mi hook que llama las actividaddes que estén en proceso
import {
  generateToken,
  getCurrentToken
} from "../services/asistencia.service";  //Acá llamo al backend para generar el token y obtener el token actual aunque hay que mejorarlo

export default function GenerarTokenTab() {

  const { actividades, loading, error } = useVerActividades();
  const [activeTokens, setActiveTokens] = React.useState({});

  // cuando se ejecuta buscamos los tokens que ya existan, si hay tokens se lo pasamos a active tokens
  useEffect(() => {
    actividades.forEach(async act => {
      try {
        const code = await getCurrentToken(act.idActividad);
        setActiveTokens(prev => ({ ...prev, [act.idActividad]: code }));
      } catch {
        // 404: no hay token activo 
      }
    });
  }, [actividades]);

  if (loading) return <p>Cargando actividades…</p>;
  if (error)   return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      {actividades.map(act => { //Acá recorreremos las actividaddes en proceso que nos devolvieron
        const token = activeTokens[act.idActividad];

        return (
          <div
            key={act.idActividad}
            style={{
              border: "1px solid #ccc",
              padding: 12,
              marginBottom: 12,
              borderRadius: 4
            }}
          >
            {/* Título y fecha */}
            <h4 style={{ margin: 0 }}>{act.tituloActividad}</h4>
            <p style={{ margin: "4px 0", fontSize: 14, color: "#555" }}>
              Fecha: {new Date(act.fechaActividad).toLocaleDateString()}
            </p>

            {/* Botón Dinámico */}
            {!token ? (
              <button
                onClick={async () => {
                  try {
                    const code = await generateToken(act.idActividad);
                    setActiveTokens(prev => ({
                      ...prev,
                      [act.idActividad]: code
                    }));
                  } catch (err) {
                    alert(err.response?.data?.error || err.message);
                  }
                }}
              >
                Generar token
              </button>
            ) : (
              <button
                onClick={() => alert(`Token: ${token}`)}
              >
                Ver token
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

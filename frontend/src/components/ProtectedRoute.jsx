import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://146.83.198.35:1293/api";

const ROLES = {
  PRESIDENTE: "2",
  TESORERO: "1",
  SECRETARIO: "3",
};

const ACCESS_BY_ROLE = {
  [ROLES.PRESIDENTE]: ['home', 'actividades', 'calendario', 'finanzas', 'asistencia', 'notificaciones'],
  [ROLES.TESORERO]: ['finanzas', 'home', 'notificaciones', 'calendario'],
  [ROLES.SECRETARIO]: ['asistencia', 'home', 'notificaciones', 'calendario'],
};


const LIBERADOS = ['home', 'calendario', 'notificaciones'];

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('jwt');
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const rut = userData?.student?.rutEstudiante;

  const currentPath = location.pathname.split('/')[1]; // obtiene la ruta sin slash

  // 1. No hay token, redirige
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  // 2. Carga los roles si aún no los tenemos
  useEffect(() => {
    if (!rut) {
      setRoles([]);
      setLoading(false);
      return;
    }

    fetch(`${BASE_URL}/roles/estudiante/${rut}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === "Success" && Array.isArray(data.data?.roles)) {
          setRoles(data.data.roles.map(r => r.idRol));
        } else {
          setRoles([]);
        }
      })
      .catch(() => setRoles([]))
      .finally(() => setLoading(false));
  }, [rut]);

  // 3. Mientras carga roles, espera
  if (loading) return null;

  // 4. Determina los módulos permitidos según el rol
  let allowedKeys = [];
  if (roles.includes(ROLES.PRESIDENTE)) {
    allowedKeys = ACCESS_BY_ROLE[ROLES.PRESIDENTE];
  } else if (roles.includes(ROLES.TESORERO)) {
    allowedKeys = ACCESS_BY_ROLE[ROLES.TESORERO];
  } else if (roles.includes(ROLES.SECRETARIO)) {
    allowedKeys = ACCESS_BY_ROLE[ROLES.SECRETARIO];
  } else {
    allowedKeys = LIBERADOS;
  }

  // 5. Si la ruta actual NO está permitida para el rol, redirige a home
  if (!allowedKeys.includes(currentPath)) {
    return <Navigate to="/home" replace />;
  }

  // ✅ Permitido
  return children;
}

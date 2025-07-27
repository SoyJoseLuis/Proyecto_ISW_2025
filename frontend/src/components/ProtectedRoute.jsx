// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

const BASE_URL =
  import.meta.env.VITE_BASE_URL ||
  "http://146.83.198.35:1293/api";

const ROLES = {
  PRESIDENTE: "2",
  TESORERO:   "1",
  SECRETARIO:"3",
};

const ACCESS_BY_ROLE = {
  [ROLES.PRESIDENTE]: [
    'home','actividades','calendario','finanzas','asistencia','notificaciones'
  ],
  [ROLES.TESORERO]: [
    'finanzas','home','notificaciones','calendario','asistencia'
  ],
  [ROLES.SECRETARIO]: [
    'asistencia','home','notificaciones','calendario'
  ],
};

// Rutas que cualquiera (sin rol) puede ver
const LIBERADOS = [
  'home','calendario','notificaciones',
  'home-estudiante','calendario-estudiante',
  'asistencia-estudiante','notificaciones-estudiante'
];

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const token    = localStorage.getItem('jwt');
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const rut      = userData?.student?.rutEstudiante;

  // 1) Si es la ruta raíz "/", la dejamos pasar para que tu index
  //    route haga el <Navigate to="/auth" /> u otra redirección.
  if (location.pathname === '/') {
    return children;
  }

  // 2) Si no hay token, vamos al login
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  // 3) Cargar roles la primera vez
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

  // 4) Mientras carga roles, no rendereamos nada
  if (loading) return null;

  // 5) Determinar qué rutas puede ver según rol
  const currentPath = location.pathname.split('/')[1];
  let allowed = LIBERADOS;

  if (roles.includes(ROLES.PRESIDENTE)) {
    allowed = ACCESS_BY_ROLE[ROLES.PRESIDENTE];
  } else if (roles.includes(ROLES.TESORERO)) {
    allowed = ACCESS_BY_ROLE[ROLES.TESORERO];
  } else if (roles.includes(ROLES.SECRETARIO)) {
    allowed = ACCESS_BY_ROLE[ROLES.SECRETARIO];
  }

  // 6) Si la ruta NO está en la lista, redirige a /home
  if (!allowed.includes(currentPath)) {
    return <Navigate to="/home" replace />;
  }

  // ✅ Si pasó todas las comprobaciones, muestra el contenido
  return children;
}

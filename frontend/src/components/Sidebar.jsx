import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  TeamOutlined,
  BellOutlined,
  LogoutOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import '../styles/Sidebar.css';

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://146.83.198.35:1293/api";

const navItems = [
  { to: '/home', label: 'Inicio', icon: <DashboardOutlined />, key: 'home' },
  { to: '/actividades', label: 'Actividades', icon: <UserOutlined />, key: 'actividades' },
  { to: '/calendario', label: 'Calendario', icon: <CalendarOutlined />, key: 'calendario' }, 
  { to: '/finanzas', label: 'Finanzas', icon: <FileTextOutlined />, key: 'finanzas' },
  { to: '/asistencia', label: 'Asistencia', icon: <TeamOutlined />, key: 'asistencia' },
  { to: '/notificaciones', label: 'Notificaciones', icon: <BellOutlined />, key: 'notificaciones' },
];

const ROLES = {
  PRESIDENTE: "2",
  TESORERO: "1",
  SECRETARIO: "3",
};

const ACCESS_BY_ROLE = {
  [ROLES.PRESIDENTE]: navItems.map(item => item.key), // TODOS los módulos
  [ROLES.TESORERO]: ['finanzas','home','notificaciones'],
  [ROLES.SECRETARIO]: ['asistencia','home','notificaciones'],
};

// Si quieres dejar algunos módulos “liberados” para quienes NO tienen ningún rol:
const LIBERADOS = ['home', 'actividades', 'notificaciones'];

export default function Sidebar() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  let nombre = "";
  let rut = "";
  try {
    const userData = JSON.parse(localStorage.getItem('userData'));
    nombre = userData?.student?.nombreEstudiante || "";
    rut = userData?.student?.rutEstudiante || "";
  } catch  {
    nombre = "";
    rut = "";
  }

  useEffect(() => {
    if (!rut) return;
    fetch(`${BASE_URL}/roles/estudiante/${rut}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === "Success" && data.data && Array.isArray(data.data.roles)) {
          setRoles(data.data.roles.map(r => r.idRol));
        } else {
          setRoles([]);
        }
      })
      .catch(() => setRoles([]))
      .finally(() => setLoadingRoles(false));
  }, [rut]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('isLogged');
    navigate('/auth');
  };

  // Decide qué módulos puede ver el usuario
  let allowedKeys = [];
  if (roles.includes(ROLES.PRESIDENTE)) {
    allowedKeys = navItems.map(item => item.key); // Todos
  } else if (roles.includes(ROLES.TESORERO)) {
    allowedKeys = ACCESS_BY_ROLE[ROLES.TESORERO];
  } else if (roles.includes(ROLES.SECRETARIO)) {
    allowedKeys = ACCESS_BY_ROLE[ROLES.SECRETARIO];
  } else {
    allowedKeys = LIBERADOS; // Si no tiene roles especiales, solo módulos liberados
  }

  if (loadingRoles) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-user">
        <UserOutlined style={{ marginRight: 8, fontSize: 18 }} />
        <span>{nombre}</span>
      </div>
      <nav className="nav-list">
        {navItems
          .filter(item => allowedKeys.includes(item.key))
          .map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className="nav-item"
              activeClassName="active"
            >
              <span className="nav-icon">{icon}</span>
              <span className="nav-label">{label}</span>
            </NavLink>
        ))}
      </nav>
      <div className="nav-settings">
        <button
          className="nav-item"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            textAlign: 'left',
            padding: 0
          }}
          onClick={handleLogout}
        >
          <span className="nav-icon"><LogoutOutlined /></span>
          <span className="nav-label">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}

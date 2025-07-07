
import { NavLink } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,

  TeamOutlined,

  SettingOutlined,
  DownOutlined
} from '@ant-design/icons';
import '../styles/Sidebar.css';

const navItems = [
  { to: '/home', label: 'Inicio', icon: <DashboardOutlined /> },
  { to: '/actividades',      label: 'Actividades',      icon: <UserOutlined /> },
  { to: '/finanzas',     label: 'Finanzas',     icon: <FileTextOutlined /> },
  { to: '/asistencia',  label: 'Asistecia',  icon: <TeamOutlined /> },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="nav-list">
        {navItems.map(({ to, label, icon }) => (
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
        <NavLink to="/settings" className="nav-item" activeClassName="active">
          <span className="nav-icon"><SettingOutlined /></span>
          <span className="nav-label">Settings</span>
          <DownOutlined className="nav-caret" />
        </NavLink>
      </div>
    </aside>
  );
}

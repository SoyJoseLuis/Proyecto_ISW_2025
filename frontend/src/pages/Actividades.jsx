import { useState } from 'react';
import { PlusOutlined, UnorderedListOutlined, CalendarOutlined } from '@ant-design/icons';
import DashboardTabs from '../components/DashboardTabs';
import ModalCrearActividad from '../components/ModalCrearActividad';
import '../styles/Actividades.css';

export default function Actividades() {
  const [modalOpen, setModalOpen] = useState(false);

  const tabs = [
    {
      key: '1',
      label: 'Nueva actividad',
      icon: <PlusOutlined />,
      content: (
        <div className="crear-actividad-card-container">
          <button
            className="crear-actividad-card"
            onClick={() => setModalOpen(true)}
          >
            <div className="card-icon-wrapper">
              <PlusOutlined style={{ fontSize: 44 }} />
            </div>
            <div className="card-title">Crear actividad</div>
            <div className="card-desc">
              Agrega nuevas tareas, reuniones o recordatorios.
            </div>
          </button>
          <ModalCrearActividad
            visible={modalOpen}
            onClose={() => setModalOpen(false)}
          />
        </div>
      ),
    },
    {
      key: '2',
      label: 'Listado',
      icon: <UnorderedListOutlined />,
      content: (
        <div>
          <p>Listado de actividades aquí...</p>
        </div>
      ),
    },
    {
      key: '3',
      label: 'Calendario',
      icon: <CalendarOutlined />,
      content: (
        <div>
          <p>Calendario de actividades aquí...</p>
        </div>
      ),
    },
    {
      key: '4',
      label: 'Transacciones',
      icon: <CalendarOutlined />,
      content: (
        <div>
          <p>INGRESA</p>
          <p>Salida de dinero

          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="actividades-wrapper">
      <DashboardTabs tabs={tabs} />
    </div>
  );
}

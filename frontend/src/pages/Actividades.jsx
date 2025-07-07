import { useState } from 'react';
import { PlusOutlined, UnorderedListOutlined, CalendarOutlined } from '@ant-design/icons';
import DashboardTabs from '../components/DashboardTabs';
import ModalCrearActividad from '../components/ModalCrearActividad';
import '../styles/Actividades.css';
import TablaActividades from '../components/TablaActividades';
import CalendarioActividades from '../components/CalendarioActividades';

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
        <div style={{ margin: '24px 0' }}>
          <TablaActividades />
        </div>
      )
    },
    {
      key: '3',
      label: 'Calendario',
      icon: <CalendarOutlined />,
      content: (
        <div style={{ margin: '20px 0' }}>
          <CalendarioActividades />
        </div>
      )
    },
  ];

  return (
    <div className="actividades-wrapper">
      <DashboardTabs tabs={tabs} />
    </div>
  );
}

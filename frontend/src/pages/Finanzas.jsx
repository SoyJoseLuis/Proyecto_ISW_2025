import { useState } from 'react';
import { PlusOutlined, UnorderedListOutlined, BarChartOutlined, TrophyOutlined } from '@ant-design/icons';
import DashboardTabs from '../components/DashboardTabs';
import ModalCrearTransaccion from '../components/ModalCrearTransaccion';
import ModalCrearMetaFinanciera from '../components/ModalCrearMetaFinanciera';
import '../styles/Actividades.css';

export default function Finanzas() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMetaOpen, setModalMetaOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMetaHovered, setIsMetaHovered] = useState(false);

  const tabs = [
    {
      key: '1',
      label: 'Transacciones',
      icon: <PlusOutlined />,
      content: (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <button
            className="crear-actividad-card"
            onClick={() => setModalOpen(true)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              width: '220px',
              height: '140px',
              margin: 0,
              padding: '16px 12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: isHovered ? '#e7f0ff' : '#f8fafc',
              border: 'none',
              borderRadius: '16px',
              boxShadow: isHovered 
                ? '0 14px 36px 0 rgba(80,110,255,0.16), 0 1.5px 3px #e7e8f3' 
                : '0 6px 36px 0 rgba(80,110,255,0.08), 0 1.5px 3px #e7e8f3',
              cursor: 'pointer',
              transition: 'box-shadow 0.18s, background 0.15s, transform 0.18s',
              transform: isHovered ? 'translateY(-2px) scale(1.04)' : 'translateY(0) scale(1)'
            }}
          >
            <div 
              className="card-icon-wrapper"
              style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #1976ff 85%, #6dd3fa 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                marginBottom: '12px',
                boxShadow: '0 3px 16px 0 rgba(30,90,200,0.10)'
              }}
            >
              <PlusOutlined style={{ fontSize: 24 }} />
            </div>
            <div 
              className="card-title"
              style={{
                fontSize: '16px',
                fontWeight: '800',
                color: '#223266',
                marginBottom: '6px',
                textAlign: 'center',
                lineHeight: '1.2'
              }}
            >
              Crear transacción
            </div>
            <div 
              className="card-desc"
              style={{
                fontSize: '12px',
                color: '#8ca0b9',
                textAlign: 'center',
                fontWeight: '500',
                lineHeight: '1.3',
                margin: 0
              }}
            >
              Registra ingresos y gastos del CEE.
            </div>
          </button>
          <ModalCrearTransaccion
            visible={modalOpen}
            onClose={() => setModalOpen(false)}
          />
        </div>
      ),
    },
    {
      key: '2',
      label: 'Balance general',
      icon: <BarChartOutlined />,
      content: (
        <div>
          <p> aca va la parte de balance general  </p>
        </div>
      ),
    },
    {
      key: '3',
      label: 'Meta Financiera',
      icon: <TrophyOutlined />,
      content: (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <button
            className="crear-actividad-card"
            onClick={() => setModalMetaOpen(true)}
            onMouseEnter={() => setIsMetaHovered(true)}
            onMouseLeave={() => setIsMetaHovered(false)}
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              width: '220px',
              height: '140px',
              margin: 0,
              padding: '16px 12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: isMetaHovered ? '#e7f0ff' : '#f8fafc',
              border: 'none',
              borderRadius: '16px',
              boxShadow: isMetaHovered 
                ? '0 14px 36px 0 rgba(80,110,255,0.16), 0 1.5px 3px #e7e8f3' 
                : '0 6px 36px 0 rgba(80,110,255,0.08), 0 1.5px 3px #e7e8f3',
              cursor: 'pointer',
              transition: 'box-shadow 0.18s, background 0.15s, transform 0.18s',
              transform: isMetaHovered ? 'translateY(-2px) scale(1.04)' : 'translateY(0) scale(1)'
            }}
          >
            <div 
              className="card-icon-wrapper"
              style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #ff6b35 85%, #ffa726 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                marginBottom: '12px',
                boxShadow: '0 3px 16px 0 rgba(255,107,53,0.20)'
              }}
            >
              <TrophyOutlined style={{ fontSize: 24 }} />
            </div>
            <div 
              className="card-title"
              style={{
                fontSize: '16px',
                fontWeight: '800',
                color: '#223266',
                marginBottom: '6px',
                textAlign: 'center',
                lineHeight: '1.2'
              }}
            >
              Crear meta financiera
            </div>
            <div 
              className="card-desc"
              style={{
                fontSize: '12px',
                color: '#8ca0b9',
                textAlign: 'center',
                fontWeight: '500',
                lineHeight: '1.3',
                margin: 0
              }}
            >
              Define objetivos y metas del CEE.
            </div>
          </button>
          <ModalCrearMetaFinanciera
            visible={modalMetaOpen}
            onClose={() => setModalMetaOpen(false)}
          />
        </div>
      ),
    },
    {
      key: '4',
      label: 'Reportes',
      icon: <UnorderedListOutlined />,
      content: (
        <div>
          <p>Reportes financieros aquí...</p>
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
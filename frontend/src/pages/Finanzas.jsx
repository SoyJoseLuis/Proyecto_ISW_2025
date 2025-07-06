import { useState, useRef } from 'react';
import { PlusOutlined, UnorderedListOutlined, BarChartOutlined, TrophyOutlined } from '@ant-design/icons';
import DashboardTabs from '../components/DashboardTabs';
import ModalCrearTransaccion from '../components/ModalCrearTransaccion';
import ModalCrearMetaFinanciera from '../components/ModalCrearMetaFinanciera';
import MetaFinancieraViewer from '../components/MetaFinancieraViewer';
import TransaccionesViewerTable from '../components/TransaccionesViewerTable';
import ViewerBalance from '../components/ViewerBalance';
import useGetMetas from '../hooks/metaf/useGetMetas';
import { showErrorAlert } from '../helpers/sweetAlert';
import '../styles/Actividades.css';

export default function Finanzas() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMetaOpen, setModalMetaOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMetaHovered, setIsMetaHovered] = useState(false);
  
  // Referencias para coordinar actualizaciones entre componentes hermanos
  const metaViewerRef = useRef(null);
  const transaccionesViewerRef = useRef(null);
  const balanceViewerRef = useRef(null);
  
  const { metas, refreshMetas } = useGetMetas();

  const handleMetaCreated = () => {
    // Refrescar el viewer cuando se crea una meta
    if (metaViewerRef.current && metaViewerRef.current.refreshMetas) {
      metaViewerRef.current.refreshMetas();
    }
    // Refrescar las metas en este componente también
    refreshMetas();
  };

  const handleTransaccionCreated = () => {
    // Actualizar TODOS los componentes afectados cuando se crea una transacción
    console.log('🔄 Coordinando actualización de componentes después de crear transacción');
    
    // 1. Actualizar tabla de transacciones
    if (transaccionesViewerRef.current && transaccionesViewerRef.current.refreshTransacciones) {
      console.log('📊 Actualizando tabla de transacciones');
      transaccionesViewerRef.current.refreshTransacciones();
    }
    
    // 2. Actualizar balance (ya que una nueva transacción afecta el balance)
    if (balanceViewerRef.current && balanceViewerRef.current.refreshBalance) {
      console.log('💰 Actualizando balance');
      balanceViewerRef.current.refreshBalance();
    }
    
    // 3. Actualizar metas financieras (ya que el balance afecta el porcentaje de cumplimiento)
    if (metaViewerRef.current && metaViewerRef.current.refreshMetas) {
      console.log('🎯 Actualizando metas financieras');
      metaViewerRef.current.refreshMetas();
    }
    
    // 4. Actualizar metas en este componente para mantener sincronía
    refreshMetas();
    
    console.log('✅ Actualización coordinada completada');
  };

  const handleOpenTransaccionModal = () => {
    // Verificar si existen metas financieras
    if (!metas || metas.length === 0) {
      showErrorAlert(
        'Meta financiera requerida',
        'Debes registrar una meta financiera antes de poder crear transacciones.'
      );
      return;
    }
    
    // Si hay metas, abrir el modal
    setModalOpen(true);
  };

  const tabs = [
    {
      key: '1',
      label: 'Transacciones',
      icon: <PlusOutlined />,
      content: (
        <div style={{ position: 'relative', width: '100%', height: '100%', padding: '20px' }}>
          <div style={{ display: 'flex', gap: '20px', height: '100%' }}>
            {/* Botón para crear transacción */}
            <div style={{ flexShrink: 0 }}>
              <button
                className="crear-actividad-card"
                onClick={handleOpenTransaccionModal}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
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
            </div>

            {/* Tabla de transacciones */}
            <TransaccionesViewerTable ref={transaccionesViewerRef} />
          </div>

          <ModalCrearTransaccion
            visible={modalOpen}
            onClose={() => setModalOpen(false)}
            onSuccess={handleTransaccionCreated}
          />
        </div>
      ),
    },
    {
      key: '2',
      label: 'Balance general',
      icon: <BarChartOutlined />,
      content: (
        <div style={{ padding: '20px' }}>
          <ViewerBalance ref={balanceViewerRef} />
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
            onMetaCreated={handleMetaCreated}
          />
          <MetaFinancieraViewer ref={metaViewerRef} />
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
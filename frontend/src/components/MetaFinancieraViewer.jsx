import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Select, Card, Progress, Empty, Spin } from 'antd';
import { TrophyOutlined, CalendarOutlined, DollarOutlined } from '@ant-design/icons';
import useGetMetasWithFilter from '../hooks/metaf/useGetMetasWithFilter.jsx';
import useDeleteMeta from '../hooks/metaf/useDeleteMeta.jsx';
import deleteIcon from '../assets/deleteIcon.svg';
import '../styles/MetaFinancieraViewer.css';

const { Option } = Select;

const MetaFinancieraViewer = forwardRef((props, ref) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  
  // Hook unificado para obtener datos
  const { metas, loading, error, refreshMetas } = useGetMetasWithFilter(selectedYear);
  const { loading: deleting, handleDeleteMeta } = useDeleteMeta();

  // Exponer método refreshMetas para el ref
  useImperativeHandle(ref, () => ({
    refreshMetas: () => {
      refreshMetas();
    }
  }));

  // Generar años disponibles (últimos 5 años + próximos 2 años)
  const generateAvailableYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 2; i++) {
      years.push(i);
    }
    setAvailableYears(years);
  };

  // Log para debugging
  useEffect(() => {
    console.log('MetaFinancieraViewer - selectedYear:', selectedYear);
    console.log('MetaFinancieraViewer - metas:', metas);
    console.log('MetaFinancieraViewer - loading:', loading);
    console.log('MetaFinancieraViewer - error:', error);
  }, [selectedYear, metas, loading, error]);

  useEffect(() => {
    generateAvailableYears();
  }, []);

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };



  // Determinar si está cargando
  const isLoading = loading;

  if (isLoading) {
    return (
      <div className="meta-viewer-container">
        <div className="meta-viewer-header">
          <div className="meta-viewer-title">
            <TrophyOutlined style={{ marginRight: '8px', color: '#ffffff' }} />
            Metas Financieras
          </div>
          <Select
            value={selectedYear}
            onChange={handleYearChange}
            style={{ width: 120 }}
            size="small"
            disabled
          >
            <Option value="all">Todos</Option>
            {availableYears.map(year => (
              <Option key={year} value={year}>{year}</Option>
            ))}
          </Select>
        </div>
        <div className="meta-viewer-content">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="meta-viewer-container">
      <div className="meta-viewer-header">
        <div className="meta-viewer-title">
          <TrophyOutlined style={{ marginRight: '8px', color: '#ffffff' }} />
          Metas Financieras
        </div>
        <Select
          value={selectedYear}
          onChange={handleYearChange}
          style={{ width: 120 }}
          size="small"
          suffixIcon={<CalendarOutlined />}
        >
          <Option value="all">Todos</Option>
          {availableYears.map(year => (
            <Option key={year} value={year}>{year}</Option>
          ))}
        </Select>
      </div>
      
      <div className="meta-viewer-content">
        {metas.length === 0 ? (
          <Empty
            description={
              selectedYear === 'all' 
                ? "No hay metas financieras registradas"
                : `No hay metas financieras para ${selectedYear}`
            }
            style={{ padding: '20px' }}
          />
        ) : (
          <div className="metas-list">
            {metas.map((meta, index) => (
              <Card
                key={meta.idMetaFinanciera || index}
                className="meta-card"
                bordered={false}
                style={{ marginBottom: '16px', position: 'relative'}}
              >
                {/* Botón eliminar solo si el año seleccionado es igual al año de la meta */}
                {selectedYear !== 'all' && (Number(selectedYear) === new Date(meta.createdAt || Date.now()).getFullYear()) && (
                  <button
                    className="meta-delete-btn"
                    title="Eliminar meta financiera"
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      width: 32,
                      height: 32,
                      background: '#f5f7fa',
                      border: 'none',
                      borderRadius: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    }}
                    disabled={deleting}
                    onClick={async () => {
                      const res = await handleDeleteMeta(Number(meta.idMetaFinanciera), meta.descripcionMeta || 'la meta financiera');
                      if (res.success) refreshMetas();
                    }}
                  >
                    <img src={deleteIcon} alt="Eliminar" style={{ width: 18, height: 18, filter: 'invert(16%) sepia(97%) saturate(7492%) hue-rotate(358deg) brightness(97%) contrast(119%)' }} />
                  </button>
                )}
                {/* Fin botón eliminar */}
                <div className="meta-card-header">
                  <div className="meta-info">
                    <div className="meta-amount">
                      <DollarOutlined style={{ marginRight: '4px' }} />
                      {formatCurrency(meta.metaFinanciera)}
                    </div>
                    <div className="meta-period">
                      {selectedYear === 'all' ? 
                        new Date(meta.createdAt || Date.now()).getFullYear() : 
                        selectedYear
                      }
                    </div>
                  </div>
                </div>
                
                <div className="meta-description">
                  {meta.descripcionMeta || 'Sin descripción disponible'}
                </div>
                
                <div className="meta-progress">
                  <div className="progress-info">
                    <span>Progreso</span>
                    <span>
                      {formatCurrency(meta.montoFullCrecimiento)} / {formatCurrency(meta.metaFinanciera)}
                    </span>
                  </div>
                  {(() => {
                    const porcentaje = meta.metaFinanciera ? Math.round((meta.montoFullCrecimiento / meta.metaFinanciera) * 100) : 0;
                    return <>
                      <Progress
                        percent={porcentaje}
                        strokeColor={{
                          '0%': '#1976ff',
                          '100%': '#44c7f7',
                        }}
                        trailColor="#f0f0f0"
                        showInfo={false}
                      />
                      <div className="progress-percentage">
                        {porcentaje}% completado
                      </div>
                    </>;
                  })()}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

MetaFinancieraViewer.displayName = 'MetaFinancieraViewer';

export default MetaFinancieraViewer; 
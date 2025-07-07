import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Select, Card, Progress, Empty, Spin } from 'antd';
import { TrophyOutlined, CalendarOutlined, DollarOutlined } from '@ant-design/icons';
import useGetMetasWithFilter from '../hooks/metaf/useGetMetasWithFilter.jsx';
import '../styles/MetaFinancieraViewer.css';

const { Option } = Select;

const MetaFinancieraViewer = forwardRef((props, ref) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  
  // Hook unificado para obtener datos
  const { metas, loading, error, refreshMetas } = useGetMetasWithFilter(selectedYear);

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

  // Función para calcular monto de crecimiento basado en porcentaje
  const calculateMontoCrecimiento = (metaFinanciera, porcentajeCrecimiento) => {
    if (!metaFinanciera || !porcentajeCrecimiento) return 0;
    return (metaFinanciera * porcentajeCrecimiento) / 100;
  };

  // Determinar si está cargando
  const isLoading = loading;

  if (isLoading) {
    return (
      <div className="meta-viewer-container">
        <div className="meta-viewer-header">
          <div className="meta-viewer-title">
            <TrophyOutlined style={{ marginRight: '8px', color: '#ff6b35' }} />
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
          <TrophyOutlined style={{ marginRight: '8px', color: '#ff6b35' }} />
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
                key={meta.id || index}
                className="meta-card"
                bordered={false}
                style={{ marginBottom: '16px' }}
              >
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
                      {formatCurrency(calculateMontoCrecimiento(meta.metaFinanciera, meta.porcentajeCrecimiento))} / {formatCurrency(meta.metaFinanciera)}
                    </span>
                  </div>
                  <Progress
                    percent={meta.porcentajeCrecimiento || 0}
                    strokeColor={{
                      '0%': '#ff6b35',
                      '100%': '#ffa726',
                    }}
                    trailColor="#f0f0f0"
                    showInfo={false}
                  />
                  <div className="progress-percentage">
                    {(meta.porcentajeCrecimiento || 0).toFixed(1)}% completado
                  </div>
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
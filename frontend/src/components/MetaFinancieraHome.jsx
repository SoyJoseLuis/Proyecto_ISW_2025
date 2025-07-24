import { Progress, Card, Spin, Alert } from 'antd';
import { DollarCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import useGetMetasWithFilter from '../hooks/metaf/useGetMetasWithFilter';

export default function MetaFinancieraChart() {
  const currentYear = new Date().getFullYear();
  const { metas, loading, error } = useGetMetasWithFilter(currentYear);

  if (loading) {
    return (
      <Card 
        title={
          <span>
            <TrophyOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            Meta Financiera {currentYear}
          </span>
        }
        style={{ height: '100%' }}
      >
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
          <p style={{ marginTop: 16 }}>Cargando meta financiera...</p>
        </div>
      </Card>
    );
  }

  if (error || !metas || metas.length === 0) {
    return (
      <Card 
        title={
          <span>
            <TrophyOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            Meta Financiera {currentYear}
          </span>
        }
        style={{ height: '100%' }}
      >
        <Alert
          message="Sin datos"
          description={`No hay meta financiera definida para el año ${currentYear}`}
          type="info"
          showIcon
        />
      </Card>
    );
  }

  // Tomar la primera meta del año (asumiendo que hay una por año)
  const metaActual = metas[0];
  const porcentaje = metaActual.porcentajeCrecimiento;

  // Determinar el color según el porcentaje
  const getColorByPercentage = (percent) => {
    if (percent >= 50) return '#52c41a'; // Verde
  
    if (percent >= 30) return '#fa8c16'; // Naranja
    return '#ff4d4f'; // Rojo
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  return (
    <Card 
      title={
        <span>
          <TrophyOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          Meta Financiera {currentYear}
        </span>
      }
      style={{ height: '100%' }}
    >
      <div style={{ textAlign: 'center' }}>
        <Progress
          type="circle"
          percent={porcentaje}
          size={120}
          strokeColor={getColorByPercentage(porcentaje)}
          format={percent => `${percent}%`}
        />
        
        <div style={{ marginTop: 20 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: 8
          }}>
            <DollarCircleOutlined style={{ color: '#1890ff', marginRight: 8 }} />
            <strong>Meta: {formatMoney(metaActual.metaFinanciera)}</strong>
          </div>
          
          <p style={{ 
            color: '#666', 
            margin: '8px 0',
            fontSize: '14px'
          }}>
            {metaActual.descripcionMeta}
          </p>
          
          <div style={{
            marginTop: 16,
            padding: '8px 16px',
            backgroundColor: '#f5f5f5',
            borderRadius: '6px',
            display: 'inline-block'
          }}>
            <span style={{ 
              color: getColorByPercentage(porcentaje),
              fontWeight: 'bold',
              fontSize: '16px'
            }}>
              Avance: {porcentaje}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
} 
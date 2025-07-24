import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Select, Spin, Empty } from 'antd';
import { BarChartOutlined, CalendarOutlined } from '@ant-design/icons';
import { useGetBalancesByPeriod } from '../hooks/balance';
import { formatCurrency } from '../helpers/formatData.js';
import '../styles/ViewerBalance.css';

const { Option } = Select;

const BalancesAnterioresViewer = forwardRef((props, ref) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [availableYears, setAvailableYears] = useState([]);

  // Hook para obtener el balance por periodo
  const { balance, loading, error, refetch } = useGetBalancesByPeriod(selectedYear);

  // Exponer método de refresh para el ref
  useImperativeHandle(ref, () => ({
    refreshBalances: () => {
      refetch();
    }
  }));

  // Generar años disponibles (últimos 5 años + próximos 2 años)
  useEffect(() => {
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 2; i++) {
      years.push(i);
    }
    setAvailableYears(years);
  }, [currentYear]);

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  return (
    <div className="viewer-balance-container">
      <div className="balance-card" style={{ minWidth: 350 }}>
        <div className="balance-header">
          <div className="balance-title">
            <BarChartOutlined style={{ marginRight: 8 }} />
            Balance del año
            <Select
              value={selectedYear}
              onChange={handleYearChange}
              style={{ width: 100, marginLeft: 12 }}
              size="small"
              suffixIcon={<CalendarOutlined />}
            >
              {availableYears.map(year => (
                <Option key={year} value={year}>{year}</Option>
              ))}
            </Select>
          </div>
        </div>
        <div className="balance-content">
          {loading ? (
            <div style={{ textAlign: 'center', width: '100%' }}><Spin size="large" /></div>
          ) : error ? (
            <div className="balance-card error">
              <div className="error-icon">⚠️</div>y 
              <p className="error-text">Error al cargar el balance</p>
              <p className="error-detail">{error}</p>
            </div>
          ) : !balance ? (
            <Empty description={`No hay datos de balance para ${selectedYear}`} style={{ padding: '20px' }} />
          ) : (
            <>
              <div className="balance-item">
                <div className="balance-label">Total Ingresos</div>
                <div className="balance-amount income">
                  +{formatCurrency(balance.totalIngresos)}
                </div>
              </div>
              <div className="balance-item">
                <div className="balance-label">Total Salidas</div>
                <div className="balance-amount expense">
                  -{formatCurrency(balance.totalSalidas)}
                </div>
              </div>
              <div className="balance-item total">
                <div className="balance-label">Monto Final</div>
                <div className={`balance-amount ${balance.montoActual >= 0 ? 'positive' : 'negative'}`}>
                  {formatCurrency(balance.montoActual)}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

BalancesAnterioresViewer.displayName = 'BalancesAnterioresViewer';

export default BalancesAnterioresViewer; 
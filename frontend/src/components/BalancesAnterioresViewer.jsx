import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Select, Spin,  } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
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

  // Generar años disponibles (últimos 5 años, solo hasta el actual)
  useEffect(() => {
    const years = [];
    for (let i = currentYear - 5; i <= currentYear; i++) {
      years.push(i);
    }
    setAvailableYears(years);
  }, [currentYear]);

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  return (
    <div className="viewer-balance-container">
      <div className="balance-card">
        <div className="balance-header">
          <div className="balance-title">
            <h3>Balance del año</h3>
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
          <div className="balance-icon">
            <div className="balance-icon-wrapper">💰</div>
          </div>
        </div>
        <div className="balance-content">
          {loading ? (
            <div style={{ textAlign: 'center', width: '100%' }}><Spin size="large" /></div>
          ) : error ? (
            <div className="balance-card error">
              <div className="error-icon">⚠️</div>
              <p className="error-text">Error al cargar el balance</p>
              <p className="error-detail">{error}</p>
            </div>
          ) : !balance ? (
            <div className="balance-card no-data">
              <div className="no-data-icon">📊</div>
              <p className="no-data-text">No hay datos de balance para {selectedYear}</p>
            </div>
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
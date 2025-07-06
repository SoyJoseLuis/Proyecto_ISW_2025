import { forwardRef, useImperativeHandle } from 'react';
import { useGetCurrentBalance } from '../hooks/balance/useGetCurrentBalance.jsx';
import { formatCurrency } from '../helpers/formatData.js';
import '../styles/ViewerBalance.css';

const ViewerBalance = forwardRef((props, ref) => {
  const { balance, loading, error, refetch } = useGetCurrentBalance(false); // Desactivar autoRefresh

  // Exponer método de refresh para el ref
  useImperativeHandle(ref, () => ({
    refreshBalance: () => {
      refetch();
    }
  }));

  if (loading) {
    return (
      <div className="viewer-balance-container">
        <div className="balance-card loading">
          <div className="loading-spinner"></div>
          <p className="loading-text">Cargando balance...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="viewer-balance-container">
        <div className="balance-card error">
          <div className="error-icon">⚠️</div>
          <p className="error-text">Error al cargar el balance</p>
          <p className="error-detail">{error}</p>
        </div>
      </div>
    );
  }

  if (!balance) {
    return (
      <div className="viewer-balance-container">
        <div className="balance-card no-data">
          <div className="no-data-icon">📊</div>
          <p className="no-data-text">No hay datos de balance disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="viewer-balance-container">
      <div className="balance-card">
        <div className="balance-header">
          <div className="balance-title">
            <h3>Balance Actual</h3>
            {balance.periodo && (
              <span className="balance-period">Período: {balance.periodo}</span>
            )}

          </div>
          <div className="balance-icon">
            <div className="balance-icon-wrapper">
              💰
            </div>
          </div>
        </div>
        
        <div className="balance-content">
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
          
          <div className="balance-separator"></div>
          
          <div className="balance-item total">
            <div className="balance-label">Monto Actual</div>
            <div className={`balance-amount ${balance.montoActual >= 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(balance.montoActual)}
            </div>
          </div>
        </div>
        
        <div className="balance-footer">
          <div className="balance-meta">
            <span className="balance-date">
              Balance ID: {balance.idBalanceCEE}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});

ViewerBalance.displayName = 'ViewerBalance';

export default ViewerBalance; 
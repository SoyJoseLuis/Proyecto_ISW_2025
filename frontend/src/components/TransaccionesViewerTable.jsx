import { forwardRef, useImperativeHandle } from 'react';
import { Table, Tag, Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useDeleteTransaccion } from '../hooks/transaccion';
import { useGetCurrentBalance } from '../hooks/balance';
import { showErrorAlert } from '../helpers/sweetAlert';

const TransaccionesViewerTable = forwardRef((props, ref) => {
  const { transacciones, refetchTransacciones, onDeleteSuccess } = props;
  const { deleteTransaccion, isLoading: deleteLoading } = useDeleteTransaccion();
  const { balance: currentBalance, refetch: refetchBalance } = useGetCurrentBalance(false); // Desactivamos el autoRefresh

  // Exponemos métodos para que el componente padre pueda llamarlos
  useImperativeHandle(ref, () => ({
    refreshTransacciones: refetchTransacciones,
    refreshBalance: refetchBalance
  }));

  // Función para verificar si una transacción puede ser eliminada (dentro de 5 minutos)
  const canDeleteTransaction = (fechaCreacion) => {
    if (!fechaCreacion) return false;
    
    const creationDate = dayjs(fechaCreacion);
    const now = dayjs();
    const diffInMinutes = now.diff(creationDate, 'minute');
    return diffInMinutes <= 5;
  };

  // Función para validar si el balance quedaría negativo al eliminar un ingreso
  const validateBalanceAfterDelete = async (transaccion) => {
    // Si no es un ingreso, no necesitamos validar
    if (transaccion.idTipoTransaccion !== '1') return true;
    
    try {
      // Si no tenemos balance cargado, intentar obtenerlo
      if (!currentBalance) {
        await refetchBalance();
        // Si después del refetch seguimos sin balance, no podemos validar
        if (!currentBalance) {
          console.error('No se pudo obtener el balance actual');
          // En caso de duda, permitir la eliminación para no bloquear al usuario
          return true;
        }
      }
      
      console.log('Validando eliminación de transacción:', {
        tipoTransaccion: transaccion.idTipoTransaccion,
        montoTransaccion: transaccion.montoTransaccion,
        balanceActual: currentBalance.montoActual,
        balanceResultante: currentBalance.montoActual - transaccion.montoTransaccion
      });
      
      // Calcular el balance resultante después de eliminar el ingreso
      const balanceResultante = currentBalance.montoActual - transaccion.montoTransaccion;
      
      return balanceResultante >= 0;
      
    } catch (error) {
      console.error('Error al validar balance:', error);
      // En caso de error, permitir la eliminación para no bloquear al usuario
      return true;
    }
  };

  // Función para manejar la eliminación
  const handleDelete = async (record) => {
    try {
      // Validar si el balance quedaría negativo
      const isValidDelete = await validateBalanceAfterDelete(record);
      if (!isValidDelete) {
        showErrorAlert(
          'Error',
          'No se puede eliminar esta transacción porque el balance quedaría negativo'
        );
        return;
      }

      await deleteTransaccion(record);
      
      // Notificar al componente padre para que maneje todas las actualizaciones
      if (onDeleteSuccess) {
        await onDeleteSuccess();
      }
      
      // Solo actualizar el balance interno del componente
      await refetchBalance();

    } catch (error) {
      console.error('Error al eliminar transacción:', error);
    }
  };

  // Columnas para la tabla de transacciones
  const columnsTransacciones = [
    {
      title: 'Tipo',
      dataIndex: 'tipoTransaccionDescripcion',
      key: 'tipoTransaccionDescripcion',
      width: 100,
      align: 'center',
      render: (descripcion, record) => (
        <Tag color={record.idTipoTransaccion === '1' ? 'green' : 'red'}>
          {descripcion}
        </Tag>
      ),
    },
    {
      title: 'Monto',
      dataIndex: 'montoTransaccion',
      key: 'montoTransaccion',
      width: 120,
      align: 'center',
      render: (monto) => `$${monto?.toLocaleString('es-CL')}`,
    },
    {
      title: 'Fecha',
      dataIndex: 'fechaTransaccion',
      key: 'fechaTransaccion',
      width: 120,
      align: 'center',
      sorter: (a, b) => dayjs(a.fechaTransaccion).unix() - dayjs(b.fechaTransaccion).unix(),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Estudiante',
      dataIndex: 'nombreEstudiante',
      key: 'nombreEstudiante',
      width: 150,
      align: 'center',
      render: (nombre, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{nombre}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.rutEstudiante}</div>
        </div>
      ),
    },
    {
      title: 'Motivo',
      dataIndex: 'motivoTransaccion',
      width: 300,
      key: 'motivoTransaccion',
      align: 'center',
      ellipsis: true,
      render: (motivo) => (
        <span title={motivo}>{motivo}</span>
      ),
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 80,
      align: 'center',
      render: (_, record) => {
        const canDelete = canDeleteTransaction(record.fechaCreacion);
        
        return (
          <Popconfirm
            title="¿Estás seguro de eliminar esta transacción?"
            description="Esta acción no se puede deshacer."
            onConfirm={() => handleDelete(record)}
            okText="Sí, eliminar"
            cancelText="Cancelar"
            disabled={!canDelete}
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              size="small"
              loading={deleteLoading}
              disabled={!canDelete}
              style={{
                color: canDelete ? '#ff4d4f' : '#d9d9d9',
                cursor: canDelete ? 'pointer' : 'not-allowed'
              }}
              title={canDelete ? 'Eliminar transacción' : 'Solo se puede eliminar durante los primeros 5 minutos'}
            />
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <div style={{ 
      flex: 1, 
      background: '#fff',
      borderRadius: '16px',
      boxShadow: '0 6px 36px 0 rgba(80,110,255,0.08), 0 1.5px 3px #e7e8f3',
      overflow: 'hidden'
    }}>
      <div style={{ 
        padding: '16px 20px',
        borderBottom: '1px solid #f0f0f0',
        background: '#fafafa'
      }}>
        <h3 style={{ 
          margin: 0,
          fontSize: '16px',
          fontWeight: '600',
            background: 'linear-gradient(135deg, #1976ff 85%, #6dd3fa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Historial de Transacciones
        </h3>
      </div>
      <div style={{ padding: '0' }}>
        <Table
          columns={columnsTransacciones}
          dataSource={transacciones}
          loading={false} // isLoading is removed, so set to false or handle loading state if needed
          rowKey="id"
          size="small"
          pagination={{
            pageSize: 8,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} de ${total} transacciones`,
          }}
          scroll={{ x: 800 }}
        />
      </div>
    </div>
  );
});

TransaccionesViewerTable.displayName = 'TransaccionesViewerTable';

export default TransaccionesViewerTable; 

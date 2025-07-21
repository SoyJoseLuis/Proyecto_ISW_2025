import { forwardRef, useImperativeHandle } from 'react';
import { Table, Tag } from 'antd';
import { useGetTransacciones } from '../hooks/transaccion';

const TransaccionesViewerTable = forwardRef((props, ref) => {
  const { transacciones, isLoading, refetch } = useGetTransacciones();

  // Exponemos el método refresh para que el componente padre pueda llamarlo
  useImperativeHandle(ref, () => ({
    refreshTransacciones: refetch
  }));

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
          loading={isLoading}
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
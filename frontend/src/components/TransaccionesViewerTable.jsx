import { forwardRef, useImperativeHandle } from 'react';
import { Table, Tag, Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useDeleteTransaccion } from '../hooks/transaccion';

const TransaccionesViewerTable = forwardRef((props, ref) => {
  const { transacciones, refetchTransacciones, onDeleteSuccess } = props;
  const { deleteTransaccion, isLoading: deleteLoading } = useDeleteTransaccion();

  // Exponemos el método refresh para que el componente padre pueda llamarlo
  useImperativeHandle(ref, () => ({
    refreshTransacciones: refetchTransacciones
  }));

  // Función para verificar si una transacción puede ser eliminada (dentro de 5 minutos)
  const canDeleteTransaction = (fechaCreacion) => {
    // 1. Verificar que tengamos una fecha válida
    if (!fechaCreacion) return false;
    
    // 2. PROBLEMA: El servidor envía fechas como "2025-07-27T15:03:03.336Z"
    //    - La hora 15:03:03 es HORA CHILENA (local del servidor)
    //    - Pero la "Z" le dice al navegador que es UTC
    //    - Esto causa una diferencia de 3-4 horas
    
    // 3. SOLUCIÓN: Quitar la "Z" para que JavaScript interprete como hora local
    const fechaSinZ = fechaCreacion.replace('Z', '');
    // Ejemplo: "2025-07-27T15:03:03.336Z" → "2025-07-27T15:03:03.336"
    
    // 4. Convertir la fecha corregida a timestamp (milisegundos desde 1970)
    const creationTimestamp = new Date(fechaSinZ).getTime();
    // Ejemplo: creationTimestamp = 1753628583336
    
    // 5. Obtener el timestamp actual (también en milisegundos)
    const nowTimestamp = Date.now();
    // Ejemplo: nowTimestamp = 1753628883336 (5 minutos después)
    
    // 6. Calcular cuántos minutos han pasado desde la creación
    const diffInMinutes = (nowTimestamp - creationTimestamp) / (1000 * 60);
    // ¿Por qué dividir entre (1000 * 60)?
    // - Los timestamps están en milisegundos
    // - 1000 ms = 1 segundo
    // - 1000 * 60 = 60,000 ms = 1 minuto
    // Ejemplo: (1753628883336 - 1753628583336) / 60000 = 5 minutos
    
    // 7. Debug temporal - ver qué valores estamos calculando
    console.log('fechaCreacion original:', fechaCreacion);
    console.log('fechaCreacion sin Z:', fechaSinZ);
    console.log('creationTimestamp:', creationTimestamp);
    console.log('nowTimestamp:', nowTimestamp);
    console.log('Diferencia en minutos:', diffInMinutes);
    
    // 8. DECISIÓN FINAL: ¿Permitir eliminar?
    // Si han pasado 5 minutos o menos → true (se puede eliminar)
    // Si han pasado más de 5 minutos → false (no se puede eliminar)
    return diffInMinutes <= 5;
  };

  // Función para manejar la eliminación
  const handleDelete = async (record) => {
    try {
      await deleteTransaccion(record);
      await refetchTransacciones(); // Fuerza la actualización de la lista
      if (onDeleteSuccess) onDeleteSuccess(); // <-- Call the callback if provided
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
      sorter: (a, b) => new Date(a.fechaTransaccion).getTime() - new Date(b.fechaTransaccion).getTime(),
      defaultSortOrder: 'descend',
     sorter: (a, b) => {
        const parsearFecha = (fechaStr) => {
          // Si viene en formato DD-MM-YYYY
          if (fechaStr.includes('-') && fechaStr.length === 10) {
            const [dia, mes, año] = fechaStr.split('-');
            return new Date(parseInt(año), parseInt(mes) - 1, parseInt(dia));
          }
          // Si viene en otro formato
          return new Date(fechaStr);
        };
        
        const fechaA = parsearFecha(a.fechaTransaccion);
        const fechaB = parsearFecha(b.fechaTransaccion);
        
        return fechaA.getTime() - fechaB.getTime();
      },
      render: (fecha) => {
        console.log('fecha de transaccion <= 5:', fecha);
        return fecha;
      },
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

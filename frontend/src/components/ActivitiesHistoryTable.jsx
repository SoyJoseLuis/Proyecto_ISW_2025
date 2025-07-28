// src/components/ActivitiesHistoryTable.jsx
import { useState } from 'react';
import { Table, Button, Modal, Card, Typography, Space, DatePicker } from 'antd';
import { UnorderedListOutlined, HistoryOutlined } from '@ant-design/icons';
import { useVerHistorialAsistencia } from '../hooks/asistencia/useVerHistorialAsistencia.js';
import { listAll } from '../services/asistencia.service.js';
import FinalListModal from './FinalListModal';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function ActivitiesHistoryTable() {
  const { historial, loading, error } = useVerHistorialAsistencia();
  const [finalModal, setFinalModal]   = useState({ visible: false, list: [] });
  const [dateRange, setDateRange]     = useState([]);

  const openFinal = async actId => {
    try {
      const list = await listAll(actId);
      setFinalModal({ visible: true, list });
    } catch {
      Modal.error({
        title: 'Error',
        content: 'No se pudo cargar la lista final',
      });
    }
  };

  // Filtrar por rango de fecha (array de 2 momentos). Si no hay rango, muestra todo.
  const filteredData = historial.filter(item => {
    if (dateRange.length !== 2) return true;
    const [start, end] = dateRange;
    const fecha = new Date(item.fechaActividad);
    return (
      fecha >= start.startOf('day').toDate() &&
      fecha <= end.endOf('day').toDate()
    );
  });

  const columns = [
    {
      title: 'Actividad',
      dataIndex: 'tituloActividad',
      key: 'tituloActividad',
      render: text => <strong>{text}</strong>,
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcionActividad',
      key: 'descripcionActividad',
      ellipsis: true,
    },
    {
      title: 'Fecha',
      dataIndex: 'fechaActividad',
      key: 'fechaActividad',
      render: f => new Date(f).toLocaleDateString(),
    },
    {
      title: 'Lista final',
      key: 'final',
      align: 'center',
      render: (_, record) => (
<Button
     size="large"
       shape="circle"
        type="primary"
        icon={<UnorderedListOutlined style={{ fontSize: 18, color: '#fff' }} />}
        onClick={() => openFinal(record.idActividad)}
      />
      ),
    },
  ];

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <>
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <HistoryOutlined style={{ fontSize: 24, color: '#1890ff' }} />
          <div>
            <Title level={4} style={{ margin: 0 }}>
              Historial de Asistencias
            </Title>
            <Text type="secondary">
              Actividades archivadas y sus listas finales
            </Text>
          </div>
        </Space>
      </Card>

      <RangePicker
        style={{ marginBottom: 16 }}
        onChange={dates => setDateRange(dates || [])}
      />

      <Table
        rowKey="idActividad"
        loading={loading}
        dataSource={filteredData}
        columns={columns}
        pagination={false}
      />

      <FinalListModal
        visible={finalModal.visible}
        list={finalModal.list}
        onClose={() => setFinalModal({ visible: false, list: [] })}
      />
    </>
  );
}

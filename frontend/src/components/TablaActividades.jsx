import { useEffect, useState } from 'react';
import { Table, Tag, Spin, message, Button, Tooltip } from 'antd';
import { ArrowUpOutlined, InboxOutlined } from '@ant-design/icons';
import { getActividades, actualizarEstadoActividad } from '../services/actividad.service';
import ModalConfirmacion from '../components/ModalConfirmacion';

export default function TablaActividades() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmInfo, setConfirmInfo] = useState({});

  useEffect(() => {
    cargarActividades();
  }, []);

  const cargarActividades = async () => {
    setLoading(true);
    try {
      const actividades = await getActividades();
      setData(actividades.map(a => ({ ...a, key: a.idActividad })));
    } catch {
      message.error("No se pudieron cargar las actividades");
    }
    setLoading(false);
  };

  function getEstadoColor(estado) {
    switch (estado) {
      case 'Pendiente':   return 'orange';
      case 'Archivada':   return 'default';
      case 'En proceso':  return 'blue';
      case 'Finalizada':  return 'green';
      default:            return 'gray';
    }
  }

  // Abre el modal antes de ejecutar la acción
  const openConfirm = ({ record, type, nextEstado }) => {
    const isArchive = type === 'archivar';
    setConfirmInfo({
      record,
      nextEstado,
      type,
      title: isArchive ? 'Archivar actividad' : 'Cambiar estado',
      message: isArchive
        ? `¿Deseas archivar "${record.tituloActividad}"?`
        : `¿Subir "${record.tituloActividad}" al siguiente estado?`,
    });
    setConfirmVisible(true);
  };

  // Cuando confirma
  const handleConfirm = async () => {
    const { record, nextEstado, type } = confirmInfo;
    setConfirmVisible(false);
    setLoadingId(`${record.key}-${type}`);
    try {
      await actualizarEstadoActividad(record.idActividad, nextEstado);
      message.success("Estado actualizado");
      await cargarActividades();
    } catch (err) {
      message.error(err.message);
    }
    setLoadingId(null);
  };

  const estadoOptions = [
    { text: 'Pendiente', value: 'Pendiente' },
    { text: 'En proceso', value: 'En proceso' },
    { text: 'Finalizada', value: 'Finalizada' },
    { text: 'Archivada', value: 'Archivada' },
  ];

  const columns = [
    { title: "Título", dataIndex: "tituloActividad", key: "tituloActividad" },
    { title: "Fecha", dataIndex: "fechaActividad", key: "fechaActividad" },
    { title: "Hora inicio", dataIndex: "horaInicioActividad", key: "horaInicioActividad" },
    { title: "Hora término", dataIndex: "horaTerminoActividad", key: "horaTerminoActividad" },
    { title: "Ubicación", dataIndex: "ubicacionActividad", key: "ubicacionActividad" },
    {
      title: "Estado",
      dataIndex: "estadoActividad",
      key: "estadoActividad",
      filters: estadoOptions,
      onFilter: (value, record) =>
        record.estadoActividad?.descripcionEstadoActividad === value,
      render: estado => (
        <Tag color={getEstadoColor(estado?.descripcionEstadoActividad)}>
          {estado?.descripcionEstadoActividad}
        </Tag>
      )
    },
    {
      title: "Tipo",
      dataIndex: "tipoActividad",
      key: "tipoActividad",
      render: tipo => <span>{tipo?.descripcionTipoActividad}</span>
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => {
        const id = Number(record.estadoActividad?.idEstadoActividad);
        const isEnProceso  = id === 1;
        const isArchivada  = id === 2;
        const isFinalizada = id === 3;
        const isPendiente  = id === 4;

        let nextEstado = null;
        if (isPendiente)      nextEstado = 1; // Pendiente→En proceso
        else if (isEnProceso) nextEstado = 3; // En proceso→Finalizada

        return (
          <div style={{ display: 'flex', gap: 8 }}>
            <Tooltip title="Subir de estado">
              <Button
                icon={<ArrowUpOutlined />}
                size="small"
                type="primary"
                disabled={isFinalizada || isArchivada}
                loading={loadingId === `${record.key}-up`}
                onClick={() => openConfirm({ record, type: 'up', nextEstado })}
              />
            </Tooltip>

            <Tooltip title="Archivar">
              <Button
                icon={<InboxOutlined />}
                size="small"
                danger
                disabled={isEnProceso || isArchivada}
                loading={loadingId === `${record.key}-archivar`}
                onClick={() => openConfirm({ record, type: 'archivar', nextEstado: 2 })}
              />
            </Tooltip>
          </div>
        );
      }
    }
  ];

  return (
    <>
      <Spin spinning={loading}>
        <Table
          dataSource={data}
          columns={columns}
          pagination={{ pageSize: 6 }}
          bordered
          size="middle"
        />
      </Spin>

      <ModalConfirmacion
        visible={confirmVisible}
        title={confirmInfo.title}
        message={confirmInfo.message}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmVisible(false)}
      />
    </>
  );
}

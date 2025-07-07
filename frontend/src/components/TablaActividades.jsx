import { useEffect, useState } from 'react';
import { Table, Tag, Spin, message, Button, Tooltip } from 'antd';
import { ArrowUpOutlined, InboxOutlined } from '@ant-design/icons';
import { getActividades, actualizarEstadoActividad } from '../services/actividad.service';

export default function TablaActividades() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    cargarActividades()
  }, []);

  // Refresca la tabla
  const cargarActividades = async () => {
    setLoading(true);
    try {
      const actividades = await getActividades();
      setData(actividades.map(a => ({
        ...a,
        key: a.idActividad
      })));
    } catch {
      message.error("No se pudieron cargar las actividades");
    }
    setLoading(false);
  };

  // Obtén color según estado
  function getEstadoColor(estado) {
    switch (estado) {
      case 'Pendiente': return 'orange';
      case 'Archivada': return 'default';
      case 'En proceso': return 'blue';
      case 'Finalizada': return 'green';
      default: return 'gray';
    }
  }

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
      render: estado =>
        <Tag color={getEstadoColor(estado?.descripcionEstadoActividad)}>
          {estado?.descripcionEstadoActividad}
        </Tag>
    },
    { 
      title: "Tipo", 
      dataIndex: "tipoActividad",
      key: "tipoActividad",
      render: tipo =>
        <span>
          {tipo?.descripcionTipoActividad}
        </span>
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => {
        // Estados: pendiente(3) -> en proceso(1) -> finalizada(4), archivada(2)
        const estadoActual = Number(record.idEstadoActividad);
        const isFinalizada = estadoActual === 4;
        const isPendiente = estadoActual === 3;
        const isEnProceso = estadoActual === 1;
        const isArchivada = estadoActual === 2;

        // Calcular siguiente estado para el botón UP
        let nextEstado = null;
        if (isPendiente) nextEstado = 1;        // 3->1
        else if (isEnProceso) nextEstado = 4;   // 1->4

        return (
          <div style={{ display: 'flex', gap: 8 }}>
            <Tooltip title="Subir de estado">
              <Button
                icon={<ArrowUpOutlined />}
                size="small"
                type="primary"
                disabled={isFinalizada || isArchivada}
                loading={loadingId === `${record.key}-up`}
                onClick={async () => {
                  setLoadingId(`${record.key}-up`);
                  try {
                    await actualizarEstadoActividad(record.idActividad, nextEstado);
                    message.success("Estado actualizado");
                    await cargarActividades(); // refresca
                  } catch (err) {
                    message.error(err.message);
                  }
                  setLoadingId(null);
                }}
              />
            </Tooltip>
            <Tooltip title="Archivar">
              <Button
                icon={<InboxOutlined />}
                size="small"
                danger
                disabled={isEnProceso || isArchivada}
                loading={loadingId === `${record.key}-archivar`}
                onClick={async () => {
                  setLoadingId(`${record.key}-archivar`);
                  try {
                    await actualizarEstadoActividad(record.idActividad, 2); // Estado archivada
                    message.success("Actividad archivada");
                    await cargarActividades(); // refresca
                  } catch (err) {
                    message.error(err.message);
                  }
                  setLoadingId(null);
                }}
              />
            </Tooltip>
          </div>
        );
      }
    }
  ];

  return (
    <Spin spinning={loading}>
      <Table
        dataSource={data}
        columns={columns}
        pagination={{ pageSize: 6 }}
        bordered
        size="middle"
      />
    </Spin>
  );
}

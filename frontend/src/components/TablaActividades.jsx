
import { useEffect, useState } from 'react';
import { Table, Tag, Spin, message, Button, Tooltip } from 'antd';
import { ArrowUpOutlined, InboxOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { 
  getActividades, 
  actualizarEstadoActividad 
} from '../services/actividad.service';

import ModalConfirmacion from './ModalConfirmacion';
import ModalEditarActividad from './ModalEditarActividad';

dayjs.locale('es');

export default function TablaActividades() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmInfo, setConfirmInfo] = useState({});
  
  const [editVisible, setEditVisible] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    cargarActividades();
  }, []);

  const cargarActividades = async () => {
    setLoading(true);
    try {
      const actividades = await getActividades();
      setData(actividades.map(a => ({ ...a, key: a.idActividad })));
    } catch {
      message.error('No se pudieron cargar las actividades');
    }
    setLoading(false);
  };

  function getEstadoColor(descripcion) {
    switch (descripcion) {
      case 'Pendiente':   return 'orange';
      case 'Archivada':   return 'default';
      case 'En proceso':  return 'blue';
      case 'Finalizada':  return 'green';
      default:            return 'gray';
    }
  }

  const openConfirm = ({ record, type, nextEstado }) => {
    const isArchive = type === 'archivar';
    setConfirmInfo({
      record,
      nextEstado,
      type,
      title: isArchive ? 'Cancelar actividad' : 'Cambiar estado',
      message: isArchive
        ? `¿Deseas cancelar "${record.tituloActividad}"?`
        : `¿Subir "${record.tituloActividad}" al siguiente estado?`,
    });
    setConfirmVisible(true);
  };

  const handleConfirm = async () => {
    const { record, nextEstado, type } = confirmInfo;
    setConfirmVisible(false);
    setLoadingId(`${record.key}-${type}`);
    try {
      await actualizarEstadoActividad(record.idActividad, nextEstado);
      message.success('Estado actualizado');
      await cargarActividades();
    } catch (err) {
      message.error(err.message);
    }
    setLoadingId(null);
  };

  const columns = [
    { title: 'Título',      dataIndex: 'tituloActividad', key: 'tituloActividad' },
    { title: 'Fecha',       dataIndex: 'fechaActividad',  key: 'fechaActividad' },
    { title: 'Hora inicio', dataIndex: 'horaInicioActividad', key: 'horaInicioActividad' },
    { title: 'Hora término',dataIndex: 'horaTerminoActividad', key: 'horaTerminoActividad' },
    { title: 'Ubicación',   dataIndex: 'ubicacionActividad', key: 'ubicacionActividad' },
    {
      title: 'Estado',
      dataIndex: 'estadoActividad',
      key: 'estadoActividad',
      filters: [
        { text: 'Pendiente', value: 'Pendiente' },
        { text: 'En proceso', value: 'En proceso' },
        { text: 'Finalizada', value: 'Finalizada' },
        { text: 'Archivada',  value: 'Archivada' },
      ],
      onFilter: (value, record) =>
        record.estadoActividad?.descripcionEstadoActividad === value,
      render: estado => (
        <Tag color={getEstadoColor(estado?.descripcionEstadoActividad)}>
          {estado?.descripcionEstadoActividad}
        </Tag>
      )
    },
    {
      title: 'Tipo',
      dataIndex: 'tipoActividad',
      key: 'tipoActividad',
      render: tipo => <span>{tipo?.descripcionTipoActividad}</span>
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, record) => {
        const id = Number(record.estadoActividad?.idEstadoActividad);
        const isEnProceso  = id === 1;
        const isArchivada  = id === 2;
        const isFinalizada = id === 3;
        const isPendiente  = id === 4;

        // Construimos fecha+hora de inicio para comparar
        const startDateTime = dayjs(
          `${record.fechaActividad} ${record.horaInicioActividad}`,
          'YYYY-MM-DD HH:mm:ss'
        );
        const now = dayjs();

        // Lógica de habilitación:
        // - Cancelar solo si está Pendiente
        // - Subir de Pendiente a En proceso sólo si startDateTime <= now
        // - Subir de En proceso a Finalizada siempre
        // - Editar sólo si está Pendiente
        // - Ninguna acción si Finalizada o Archivada
        const disableCancel = !isPendiente;
        const disableUp = isFinalizada || isArchivada ||
          (isPendiente && startDateTime.isAfter(now));
        const disableEdit = !isPendiente;

        let nextEstado = null;
        if (isPendiente)      nextEstado = 1; // Pendiente→En proceso
        else if (isEnProceso) nextEstado = 3; // En proceso→Finalizada

        return (
          <div style={{ display: 'flex', gap: 8 }}>
            <Tooltip title="Editar actividad">
              <Button
                icon={<EditOutlined />}
                size="small"
                disabled={disableEdit}
                onClick={() => {
                  setEditId(record.idActividad);
                  setEditVisible(true);
                }}
              />
            </Tooltip>

            <Tooltip title="Subir de estado">
              <Button
                icon={<ArrowUpOutlined />}
                size="small"
                type="primary"
                disabled={disableUp}
                loading={loadingId === `${record.key}-up`}
                onClick={() => openConfirm({ record, type: 'up', nextEstado })}
              />
            </Tooltip>

            <Tooltip title="Cancelar">
              <Button
                icon={<InboxOutlined />}
                size="small"
                danger
                disabled={disableCancel}
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

      <ModalEditarActividad
        visible={editVisible}
        actividadId={editId}
        onClose={() => setEditVisible(false)}
        onUpdated={cargarActividades}
      />
    </>
  );
}

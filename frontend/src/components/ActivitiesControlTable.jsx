// src/components/ActivitiesControlTable.jsx
import { useEffect, useState } from 'react';
import { Table, Button, Modal } from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  FormOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { useVerActividades } from '../hooks/asistencia/useVerActividades';
import {
  generateToken,
  getCurrentToken,
  listPending,
  confirmAttendance,
  listAll,
} from '../services/asistencia.service';
import TokenModal from './TokenModal';
import ConfirmAttendanceModal from './ConfirmAttendanceModal';
import FinalListModal from './FinalListModal';
import '../styles/Actividades.css';

export default function ActivitiesControlTable() {
  const { actividades, loading, error } = useVerActividades();

  // Estado para tokens, y para cada uno de los tres modales
  const [tokens, setTokens] = useState({});
  const [tokenModal, setTokenModal] = useState({ visible: false, token: '' });
  const [pendingModal, setPendingModal] = useState({
    visible: false,
    actId: null,
    list: [],
    checked: {},
  });
  const [finalModal, setFinalModal] = useState({ visible: false, list: [] });

  // Al montar o cambiar actividades, cargamos los tokens activos
  useEffect(() => {
    actividades.forEach(async a => {
      try {
        const code = await getCurrentToken(a.idActividad);
        setTokens(t => ({ ...t, [a.idActividad]: code }));
      } catch {
        // no hay token → ignorar
      }
    });
  }, [actividades]);

  // Abrir modal de pendientes para una actividad
  const openPending = async actId => {
    try {
      const list = await listPending(actId);
      // Inicializamos todas las casillas en false
      const checked = {};
      list.forEach(r => {
        checked[r.rutEstudiante] = false;
      });
      setPendingModal({ visible: true, actId, list, checked });
    } catch {
      Modal.error({ title: 'Error', content: 'No se pudo cargar pendientes' });
    }
  };

  // Confirmar asistencia (dobleConfirmación) a los seleccionados
  const handlePendingOk = async () => {
    const { actId, checked } = pendingModal;
    const toConfirm = Object.entries(checked)
      // eslint-disable-next-line no-unused-vars
      .filter(([_, v]) => v)
      .map(([rut]) => rut);

    for (let rut of toConfirm) {
      try {
        await confirmAttendance(actId, rut, true);
      } catch {
        // ignorar errores individuales
      }
    }
    // cerramos modal y limpiamos
    setPendingModal(m => ({ ...m, visible: false, checked: {} }));
  };

  // Abrir modal de lista final para una actividad
  const openFinal = async actId => {
    try {
      const list = await listAll(actId);
      setFinalModal({ visible: true, list });
    } catch {
      Modal.error({ title: 'Error', content: 'No se pudo cargar lista final' });
    }
  };

  // Definición de columnas
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
      title: 'Hora inicio',
      dataIndex: 'horaInicioActividad',
      key: 'horaInicioActividad',
    },
    {
      title: 'Token',
      key: 'token',
      render: (_, record) => {
        const tok = tokens[record.idActividad];
        return tok ? (
          <Button
            icon={<EyeOutlined />}
            onClick={() => setTokenModal({ visible: true, token: tok })}
          />
        ) : (
          <Button
            icon={<PlusOutlined />}
            onClick={async () => {
              try {
                const code = await generateToken(record.idActividad);
                setTokens(t => ({ ...t, [record.idActividad]: code }));
              } catch (err) {
                Modal.error({
                  title: 'Error al generar token',
                  content: err.response?.data?.error || err.message,
                });
              }
            }}
          />
        );
      },
    },
    {
      title: 'Pendientes',
      key: 'pending',
      render: (_, record) => (
        <Button
          icon={<FormOutlined />}
          onClick={() => openPending(record.idActividad)}
        />
      ),
    },
    {
      title: 'Final',
      key: 'final',
      render: (_, record) => (
        <Button
          icon={<UnorderedListOutlined />}
          onClick={() => openFinal(record.idActividad)}
        />
      ),
    },
  ];

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <>
      <Table
        rowKey="idActividad"
        loading={loading}
        dataSource={actividades}
        columns={columns}
        pagination={false}
      />

      <TokenModal
        visible={tokenModal.visible}
        token={tokenModal.token}
        onClose={() => setTokenModal({ visible: false, token: '' })}
      />

      <ConfirmAttendanceModal
        visible={pendingModal.visible}
        list={pendingModal.list}
        checked={pendingModal.checked}
        onCheckChange={(rut, val) =>
          setPendingModal(m => ({
            ...m,
            checked: { ...m.checked, [rut]: val },
          }))
        }
        onCancel={() => setPendingModal(m => ({ ...m, visible: false }))}
        onConfirm={handlePendingOk}
      />

      <FinalListModal
        visible={finalModal.visible}
        list={finalModal.list}
        onClose={() => setFinalModal(m => ({ ...m, visible: false }))}
      />
    </>
  );
}

// src/components/ActivitiesControlTable.jsx
import { useEffect, useState } from 'react';
import { Table, Button, Modal, Card, Typography, Space  } from 'antd';
 import { notification } from 'antd';
import {PlusOutlined,EyeOutlined,FormOutlined, UnorderedListOutlined, ControlOutlined} from '@ant-design/icons';
 const { Title, Text } = Typography;
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

  // Cuando la página se recargue, se cargan los token que están activos
  useEffect(() => {
    actividades.forEach(async a => {
      try {
        const code = await getCurrentToken(a.idActividad);
        setTokens(t => ({ ...t, [a.idActividad]: code }));
      } catch {
        // Si no hay token se ignora 
      }
    });
  }, [actividades]);
//-------------------------//
  // El modal d pendientes en la lista final se abre
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

   // Confirma uno y refresca
  const handleConfirmOne = async rut => {
    try {
      await confirmAttendance(pendingModal.actId, rut, true);
      // recargar la lista para reflejar cambios
      await openPending(pendingModal.actId);
    } catch {
      // ignora
    }
  };

  // Confirma todos los seleccionados (usa el checked interno)
  const handleConfirmMultiple = async selectedRuts => {
    for (let rut of selectedRuts) {
      try {
        await confirmAttendance(pendingModal.actId, rut, true);
      } catch {
        // ignorar errores individuales
      }
    }
    // cierra modal
    setPendingModal(m => ({ ...m, visible: false, checked: {} }));
  };

  // Se abre el modal de la lista final con los de dobleConfirmación en tru
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
  align: 'center',
  render: (_, record) => {
    const tok = tokens[record.idActividad];
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {tok ? (
          <Button
           size="large"
           shape="circle"
           style={{
             backgroundColor: '#69c0ff',
            borderColor:     '#69c0ff',
            color:           '#fff'
           }}
           icon={
            <EyeOutlined
               style={{ fontSize: 20, color: '#fff' }}
             />
          }
           onClick={() =>
             setTokenModal({ visible: true, token: tok })
           }
         />
        ) : (
<Button
  size="large"
  shape="circle"
  type="primary"
  icon={<PlusOutlined style={{ fontSize: 20 }} />}
  onClick={async () => {
    try {
      const code = await generateToken(record.idActividad);
      setTokens(t => ({ ...t, [record.idActividad]: code }));
      notification.success({
        message: 'Token creado',
        description: `Código ${code} generado. Ahora puedes visualizarlo.`,
      });
    } catch (err) {
      Modal.error({
        title: 'Error al generar token',
        content: err.response?.data?.message || err.message,
      });
    }
  }}
/>

        )}
      </div>
    );
  },
},

    {
      title: 'Confirmar asistencia',
      key: 'pending',
      align: 'center',
      render: (_, record) => (
       <Button
        size="large"
         shape="circle"
         style={{
           backgroundColor: '#d9d9d9', // gris claro
           borderColor:     '#000000', // borde negro
         }}
         icon={<FormOutlined style={{ fontSize: 18, color: '#000000' }} />} 
         onClick={() => openPending(record.idActividad)}
       />
      ),
    },
    {
      title: 'Lista final',
      key: 'final',
      align: 'center',
      render: (_, record) => (
       <Button
         size="large"
         shape="circle"
         style={{
           backgroundColor: '#ffffff', // fondo blanco
           borderColor:     '#000000', // borde negro
         }}
         icon={
           <UnorderedListOutlined
             style={{ fontSize: 18, color: '#000000' }} // icono negro
           />
         }
         onClick={() => openFinal(record.idActividad)}
      />
      ),
    },
  ];

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    
       <>
      {/* ── Encabezado Sala de Control ── */}
      <Card className="control-header" bordered={false}>
        <Space align="center">
          <ControlOutlined style={{ fontSize: 32, color: '#1890ff' }} />
          <div>
            <Title level={4} style={{ margin: 0 }}>
              Sala de Control de Asistencias
            </Title>
            <Text type="secondary">
              Gestiona tokens y confirma asistencias rápidamente
            </Text>
          </div>
        </Space>
      </Card>

      {/* ── Tabla principal ── */}
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

      {/* CONFIRM ATTENDANCE MODAL */}
      <ConfirmAttendanceModal
        open={pendingModal.visible}               // 1) open en lugar de visible
        pendingList={pendingModal.list}           // 2) pendingList en lugar de list
        onClose={() =>
          setPendingModal(m => ({ ...m, visible: false }))
        }                                         // 6) onClose en lugar de onCancel
        onConfirm={handleConfirmOne}              // 4) confirma uno
        onConfirmMultiple={handleConfirmMultiple} // 5) confirma varios
      />

      {/* FINAL LIST MODAL */}
      <FinalListModal
        visible={finalModal.visible}
        list={finalModal.list}
        onClose={() =>
          setFinalModal(m => ({ ...m, visible: false }))
        }
      />
    </>
  );
}

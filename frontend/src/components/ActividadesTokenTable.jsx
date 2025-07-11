import React, { useEffect, useState } from 'react';
import { Table, Button, Modal } from 'antd';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { useVerActividades } from '../hooks/asistencia/useVerActividades';
import { generateToken, getCurrentToken } from '../services/asistencia.service';
import '../styles/Actividades.css'; // si quieres mantener estilos globales

export default function ActividadesTokenTable() {
  const { actividades, loading, error } = useVerActividades();
  const [tokens, setTokens] = useState({});
  const [modal, setModal] = useState({ visible: false, token: '' });

  // Al montar, pedimos el token activo de cada actividad
  useEffect(() => {
    actividades.forEach(async (a) => {
      try {
        const code = await getCurrentToken(a.idActividad);
        setTokens(t => ({ ...t, [a.idActividad]: code }));
      } catch {
        // 404 → no hay token
      }
    });
  }, [actividades]);

  // Configuración de columnas para AntD Table
  const columns = [
    {
      title: 'Actividad',
      dataIndex: 'tituloActividad',
      key: 'tituloActividad',
      render: (_, record) => <strong>{record.tituloActividad}</strong>,
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
      render: fecha => new Date(fecha).toLocaleDateString(),
    },
    {
      title: 'Hora inicio',
      dataIndex: 'horaInicioActividad',
      key: 'horaInicioActividad',
    },
    {
      title: 'Acción',
      key: 'action',
      render: (_, record) => {
        const tok = tokens[record.idActividad];
        return tok ? (
          <Button
            icon={<EyeOutlined />}
            onClick={() => setModal({ visible: true, token: tok })}
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
                  title: 'Error',
                  content: err.response?.data?.error || err.message,
                });
              }
            }}
          />
        );
      },
    },
  ];

  if (error) return <p className="error">{error}</p>;
  return (
    <>
      <Table
        rowKey="idActividad"
        loading={loading}
        dataSource={actividades}
        columns={columns}
        pagination={false}
      />

      <Modal
        title="Token de Asistencia"
        visible={modal.visible}
        onOk={() => setModal({ visible: false, token: '' })}
        onCancel={() => setModal({ visible: false, token: '' })}
        okText="Cerrar"
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <p style={{ fontSize: 24, textAlign: 'center' }}>{modal.token}</p>
      </Modal>
    </>
  );
}

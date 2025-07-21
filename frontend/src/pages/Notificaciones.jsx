import { useEffect, useState } from 'react';
import { BellOutlined } from '@ant-design/icons';
import { List, Avatar, Badge, Typography, Empty, Spin, message } from 'antd';
import '../styles/Notificaciones.css';

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://146.83.198.35:1293/api";

export default function Notificaciones() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let rut = '';
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      rut = userData?.student?.rutEstudiante || '';
    } catch {
      rut = '';
    }

    if (!rut) {
      message.error("No se encontró usuario logueado.");
      setLoading(false);
      return;
    }

    fetch(`${BASE_URL}/panel-notificaciones/estudiante/${rut}`)
      .then(res => res.json())
      .then(res => {
        if (res.status === "Success" && Array.isArray(res.data)) {
          setData(res.data);
        } else {
          setData([]);
        }
      })
      .catch(() => {
        message.error("No se pudieron cargar las notificaciones.");
        setData([]);
      })
      .finally(() => setLoading(false));
  }, []);

  function formatFecha(fecha) {
    if (!fecha) return "";
    const f = new Date(fecha);
    return f.toLocaleDateString("es-CL", { year: 'numeric', month: '2-digit', day: '2-digit' });
  }

  return (
    <div className="notificaciones-main-bg">
      <div className="notificaciones-container">
        <Typography.Title level={2} className="notif-title">
        </Typography.Title>
        {loading ? (
          <Spin size="large" style={{ margin: "60px 0", display: "flex", justifyContent: "center" }} />
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={data}
            locale={{ emptyText: <Empty description="Sin notificaciones" /> }}
            renderItem={item => {
              const actividad = item.actividad || {};
              return (
                <List.Item className="notif-item">
                 
                  <div className="notif-content-section">
                    <div className="notif-title-row">
                      <span className="notif-title-item">{actividad.tituloActividad || "Notificación"}</span>
                    </div>
                    <span className="notif-desc-item">
                      {item.notificacion?.descripcionNotificacion || ""}
                    </span>
                    <div className="notif-extra-info">
                      <div><strong>Fecha:</strong> {formatFecha(actividad.fechaActividad)}</div>
                      <div><strong>Hora:</strong> {actividad.horaInicioActividad} - {actividad.horaTerminoActividad}</div>
                      <div><strong>Ubicación:</strong> {actividad.ubicacionActividad}</div>
                    </div>
                  </div>
                  <div className="notif-avatar-section">
                    <Badge dot offset={[-2, 2]}>
                      <Avatar
                        shape="square"
                        size={48}
                        style={{ background: "#f4f7fa" }}
                        icon={<BellOutlined style={{ fontSize: 22, color: '#1976ff' }} />}
                      />
                    </Badge>
                  </div>
                </List.Item>
              );
            }}
          />
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Calendar, Badge, Modal, List, Spin, message, Typography } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import locale from 'antd/es/calendar/locale/es_ES';
import { getActividades } from '../services/actividad.service';
import '../styles/CalendarioPage.css';

dayjs.locale('es');

const { Title } = Typography;

export default function CalendarioPage() {
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [actividadesDelDia, setActividadesDelDia] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getActividades();
        setActividades(data);
      } catch {
        message.error('No se pudieron cargar las actividades');
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  function getListData(date) {
    const dateStr = date.format('YYYY-MM-DD');
    return actividades.filter(a => a.fechaActividad === dateStr);
  }

  function dateCellRender(date) {
    const listData = getListData(date);
    return (
      <ul className="calendar-badge-list">
        {listData.map(item => (
          <li key={item.idActividad}>
            <Badge status="processing" text={item.tituloActividad} />
          </li>
        ))}
      </ul>
    );
  }

  function onSelect(date) {
    const dateStr = date.format('YYYY-MM-DD');
    const actividadesDia = actividades.filter(a => a.fechaActividad === dateStr);
    setActividadesDelDia(actividadesDia);
    setSelectedDate(dateStr);
    setModalVisible(true);
  }

  return (
    <div className="calendario-page-wrapper">
      <Title level={2}>Calendario de Actividades</Title>

      <Spin spinning={loading}>
        <Calendar
          locale={locale}
          dateCellRender={dateCellRender}
          onSelect={onSelect}
          style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 1.5px 6px 0 rgba(120,150,200,0.06)",
            padding: 16
          }}
        />
      </Spin>

      <Modal
        open={modalVisible}
        title={`Actividades del ${selectedDate}`}
        onCancel={() => setModalVisible(false)}
        footer={null}
        centered
      >
        {actividadesDelDia.length === 0 ? (
          <div>No hay actividades para este día.</div>
        ) : (
          <List
            dataSource={actividadesDelDia}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={item.tituloActividad}
                  description={
                    <>
                      <div><b>Descripción:</b> {item.descripcionActividad}</div>
                      <div><b>Hora:</b> {item.horaInicioActividad} - {item.horaTerminoActividad}</div>
                      <div><b>Ubicación:</b> {item.ubicacionActividad}</div>
                      <div><b>Estado:</b> {item.estadoActividad?.descripcionEstadoActividad}</div>
                      <div><b>Tipo:</b> {item.tipoActividad?.descripcionTipoActividad}</div>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Modal>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Calendar, Badge, Modal, List, Spin, message } from 'antd';
import dayjs from 'dayjs';
import { getActividades } from '../services/actividad.service';

export default function CalendarioActividades() {
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

  // Agrupa actividades por fecha (YYYY-MM-DD)
  function getListData(date) {
    const dateStr = date.format('YYYY-MM-DD');
    return actividades.filter(a => a.fechaActividad === dateStr);
  }

  // Renderiza el contenido de cada celda del calendario
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

  // Cuando seleccionas un día, muestra un modal con detalles
  function onSelect(date) {
    const dateStr = date.format('YYYY-MM-DD');
    const actividadesDia = actividades.filter(a => a.fechaActividad === dateStr);
    setActividadesDelDia(actividadesDia);
    setSelectedDate(dateStr);
    setModalVisible(true);
  }

  return (
    <Spin spinning={loading}>
      <Calendar
        dateCellRender={dateCellRender}
        onSelect={onSelect}
        style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1.5px 6px 0 rgba(120,150,200,0.06)" }}
      />

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
                      <div>
                        <b>Hora:</b> {item.horaInicioActividad} - {item.horaTerminoActividad}
                      </div>
                      <div><b>Ubicación:</b> {item.ubicacionActividad}</div>
                      <div>
                        <b>Estado:</b> {item.estadoActividad?.descripcionEstadoActividad}
                      </div>
                      <div>
                        <b>Tipo:</b> {item.tipoActividad?.descripcionTipoActividad}
                      </div>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Modal>
    </Spin>
  );
}

// src/components/ModalCrearActividad.jsx
import { Modal, Form, Input, DatePicker, TimePicker, Select } from 'antd';

export default function ModalCrearActividad({ visible, onClose }) {
  // Simula los select (puedes dejar vacío si quieres)
  const estados = [
    { id: 1, nombre: 'Pendiente' },
    { id: 2, nombre: 'En curso' },
    { id: 3, nombre: 'Finalizada' }
  ];
  const tipos = [
    { id: 1, nombre: 'Reunión' },
    { id: 2, nombre: 'Tarea' },
    { id: 3, nombre: 'Recordatorio' }
  ];

  return (
    <Modal
      open={visible}
      title="Crear nueva actividad"
      onCancel={onClose}
      onOk={onClose}
      okText="Crear"
      cancelText="Cancelar"
      centered
      destroyOnClose
    >
      <Form
        layout="vertical"
        name="crear_actividad_demo"
        style={{ marginTop: 8 }}
      >
        <Form.Item label="Título" name="TITULO_ACTIVIDAD">
          <Input placeholder="Título corto" maxLength={25} />
        </Form.Item>

        <Form.Item label="Descripción" name="DESCRIPCION_ACTIVIDAD">
          <Input.TextArea placeholder="Descripción de la actividad" rows={2} maxLength={50} />
        </Form.Item>

        <Form.Item label="Fecha" name="FECHA_ACTIVIDAD">
          <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Hora de inicio" name="HORA_INICIO_ACTIVIDAD">
          <TimePicker format="HH:mm" style={{ width: '100%' }} minuteStep={5} />
        </Form.Item>

        <Form.Item label="Hora de término" name="HORA_TERMINO_ACTIVIDAD">
          <TimePicker format="HH:mm" style={{ width: '100%' }} minuteStep={5} />
        </Form.Item>

        <Form.Item label="Ubicación" name="UBICACION_ACTIVIDAD">
          <Input placeholder="Ej: Oficina central" maxLength={40} />
        </Form.Item>

        <Form.Item label="Estado" name="ID_ESTADO_ACTIVIDAD">
          <Select placeholder="Selecciona estado">
            {estados.map(e => (
              <Select.Option key={e.id} value={e.id}>{e.nombre}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Tipo" name="ID_TIPO_ACTIVIDAD">
          <Select placeholder="Selecciona tipo">
            {tipos.map(t => (
              <Select.Option key={t.id} value={t.id}>{t.nombre}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

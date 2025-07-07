import { useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, TimePicker, message } from 'antd';
import { crearActividad } from '../services/actividad.service';

const estados = [
  { label: 'En proceso', value: 1 },
  { label: 'Pendiente', value: 3 },
];

const tipos = [
  { label: 'Sin venta', value: 1 },
  { label: 'Con venta', value: 2 },
];

export default function ModalCrearActividad({ visible, onClose, onCreated }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // Formatea valores
      const payload = {
        descripcionActividad: values.descripcionActividad,
        tituloActividad: values.tituloActividad,
        fechaActividad: values.fechaActividad.format('YYYY-MM-DD'),
        horaInicioActividad: values.horaInicioActividad.format('HH:mm:ss'),
        horaTerminoActividad: values.horaTerminoActividad.format('HH:mm:ss'),
        ubicacionActividad: values.ubicacionActividad,
        idEstadoActividad: Number(values.idEstadoActividad),
        idTipoActividad: Number(values.idTipoActividad),
      };

      // Muestra en consola lo que vas a enviar
      console.log("Enviando a la API:", payload);

      setLoading(true);
      await crearActividad(payload);
      message.success('Actividad creada exitosamente');
      form.resetFields();
      setLoading(false);
      if (onCreated) onCreated(payload);
      onClose();
    } catch (err) {
      setLoading(false);
      if (err?.errorFields) return; // Error de validación de formulario
      message.error(err.message || 'Ocurrió un error');
    }
  };

  return (
    <Modal
      title="Crear nueva actividad"
      open={visible}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={loading}
      okText="Crear"
      destroyOnClose
      className="modal-crear-actividad"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          idEstadoActividad: 3,
          idTipoActividad: 1,
        }}
      >
        <Form.Item
          name="tituloActividad"
          label="Título"
          rules={[{ required: true, message: 'Ingresa un título' }]}
        >
          <Input maxLength={25} />
        </Form.Item>

        <Form.Item
          name="descripcionActividad"
          label="Descripción"
          rules={[{ required: true, message: 'Ingresa una descripción' }]}
        >
          <Input.TextArea rows={2} maxLength={50} />
        </Form.Item>

        <Form.Item
          name="fechaActividad"
          label="Fecha"
          rules={[{ required: true, message: 'Selecciona una fecha' }]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="horaInicioActividad"
          label="Hora de inicio"
          rules={[{ required: true, message: 'Selecciona la hora de inicio' }]}
        >
          <TimePicker format="HH:mm:ss" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="horaTerminoActividad"
          label="Hora de término"
          rules={[{ required: true, message: 'Selecciona la hora de término' }]}
        >
          <TimePicker format="HH:mm:ss" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="ubicacionActividad"
          label="Ubicación"
          rules={[{ required: true, message: 'Ingresa la ubicación' }]}
        >
          <Input maxLength={40} />
        </Form.Item>

        <Form.Item
          name="idEstadoActividad"
          label="Estado"
          rules={[{ required: true, message: 'Selecciona un estado' }]}
        >
          <Select options={estados} />
        </Form.Item>

        <Form.Item
          name="idTipoActividad"
          label="Tipo de actividad"
          rules={[{ required: true, message: 'Selecciona un tipo' }]}
        >
          <Select options={tipos} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

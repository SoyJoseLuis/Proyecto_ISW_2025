import React from 'react';
import { Modal, Form, Input, DatePicker, TimePicker, Select, message } from 'antd';
import dayjs from 'dayjs';

const tipos = [
  { label: 'Sin venta', value: 1 },
  { label: 'Con venta', value: 2 },
];

export default function ModalEditarActividad({ visible, onClose, actividad, onUpdate, loading }) {
  const [form] = Form.useForm();

  // Inicializa el form al abrir el modal
  React.useEffect(() => {
    if (visible && actividad) {
      form.setFieldsValue({
        tituloActividad: actividad.tituloActividad,
        descripcionActividad: actividad.descripcionActividad,
        fechaActividad: dayjs(actividad.fechaActividad),
        horaInicioActividad: dayjs(actividad.horaInicioActividad, 'HH:mm:ss'),
        horaTerminoActividad: dayjs(actividad.horaTerminoActividad, 'HH:mm:ss'),
        ubicacionActividad: actividad.ubicacionActividad,
        idTipoActividad: actividad.idTipoActividad ? Number(actividad.idTipoActividad) : 1,
      });
    }
  }, [visible, actividad]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...actividad,
        ...values,
        fechaActividad: values.fechaActividad.format('YYYY-MM-DD'),
        horaInicioActividad: values.horaInicioActividad.format('HH:mm:ss'),
        horaTerminoActividad: values.horaTerminoActividad.format('HH:mm:ss'),
        idTipoActividad: Number(values.idTipoActividad),
        // No se puede editar el estado aquí
      };
      await onUpdate(payload);
      form.resetFields();
    } catch  {
      message.error("Completa todos los campos correctamente");
    }
  };

  return (
    <Modal
      open={visible}
      title="Editar actividad"
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={loading}
      okText="Actualizar"
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item name="tituloActividad" label="Título" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="descripcionActividad" label="Descripción" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="fechaActividad" label="Fecha" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="horaInicioActividad" label="Hora inicio" rules={[{ required: true }]}>
          <TimePicker format="HH:mm:ss" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="horaTerminoActividad" label="Hora término" rules={[{ required: true }]}>
          <TimePicker format="HH:mm:ss" style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="ubicacionActividad" label="Ubicación" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="idTipoActividad" label="Tipo de actividad" rules={[{ required: true }]}>
          <Select options={tipos} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

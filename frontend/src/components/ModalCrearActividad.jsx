import { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, TimePicker, message } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import dateLocale from 'antd/es/date-picker/locale/es_ES';
import timeLocale from 'antd/es/time-picker/locale/es_ES';
import { crearActividad } from '../services/actividad.service';

dayjs.locale('es');

const estados = [
  { label: 'En proceso', value: 1 },
  { label: 'Pendiente', value: 4 },
];

const tipos = [
  { label: 'Sin venta', value: 1 },
  { label: 'Con venta', value: 2 },
];

export default function ModalCrearActividad({ visible, onClose, onCreated }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [duracion, setDuracion] = useState('');

  // Calcula duración estimada
  const calcularDuracion = () => {
    const inicio = form.getFieldValue('horaInicioActividad');
    const fin    = form.getFieldValue('horaTerminoActividad');
    if (inicio && fin) {
      const diff = fin.diff(inicio, 'minute');
      if (diff < 0) {
        setDuracion('Inválida');
      } else {
        const horas   = Math.floor(diff / 60);
        const minutos = diff % 60;
        setDuracion(`${horas}h ${minutos}min`);
      }
    } else {
      setDuracion('');
    }
  };

  useEffect(() => {
    calcularDuracion();
  }, [
    form.getFieldValue('horaInicioActividad'),
    form.getFieldValue('horaTerminoActividad')
  ]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // Formatea payload usando la misma forma que antes (HH:mm:ss)
      const payload = {
        descripcionActividad:  values.descripcionActividad,
        tituloActividad:       values.tituloActividad,
        fechaActividad:        values.fechaActividad.format('YYYY-MM-DD'),
        horaInicioActividad:   values.horaInicioActividad.format('HH:mm:ss'),
        horaTerminoActividad:  values.horaTerminoActividad.format('HH:mm:ss'),
        ubicacionActividad:    values.ubicacionActividad,
        idEstadoActividad:     Number(values.idEstadoActividad),
        idTipoActividad:       Number(values.idTipoActividad),
      };

      console.log("Enviando a la API:", payload);

      setLoading(true);
      await crearActividad(payload);
      message.success('Actividad creada exitosamente');
      form.resetFields();
      setDuracion('');
      setLoading(false);
      if (onCreated) onCreated(payload);
      onClose();
    } catch (err) {
      setLoading(false);
      if (err?.errorFields) return;
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
          idEstadoActividad: 4,
          idTipoActividad:   1,
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
          <DatePicker
            locale={dateLocale}
            style={{ width: '100%' }}
            format="YYYY-MM-DD"
            disabledDate={current => current && current < dayjs().startOf('day')}
          />
        </Form.Item>

        <Form.Item
          name="horaInicioActividad"
          label="Hora de inicio"
          rules={[{ required: true, message: 'Selecciona la hora de inicio' }]}
        >
          <TimePicker
            locale={timeLocale}
            format="HH:mm"
            style={{ width: '100%' }}
            placeholder="Hora de inicio"
            onChange={calcularDuracion}
          />
        </Form.Item>

        <Form.Item
          name="horaTerminoActividad"
          label="Hora de término"
          dependencies={['horaInicioActividad']}
          rules={[
            { required: true, message: 'Selecciona la hora de término' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const inicio = getFieldValue('horaInicioActividad');
                if (!inicio || !value) return Promise.resolve();
                if (value.isBefore(inicio)) {
                  return Promise.reject('La hora de término debe ser posterior a la de inicio');
                }
                return Promise.resolve();
              }
            })
          ]}
        >
          <TimePicker
            locale={timeLocale}
            format="HH:mm"
            style={{ width: '100%' }}
            placeholder="Hora de término"
            onChange={calcularDuracion}
          />
        </Form.Item>

        <Form.Item label="Duración estimada">
          <Input value={duracion} disabled />
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

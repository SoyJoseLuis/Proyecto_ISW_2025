import { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, TimePicker, message } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import dateLocale from 'antd/es/date-picker/locale/es_ES';
import timeLocale from 'antd/es/time-picker/locale/es_ES';
import { crearActividad } from '../services/actividad.service';

dayjs.locale('es');

const tipos = [
  { label: 'Sin venta', value: 1 },
  { label: 'Con venta', value: 2 },
];

export default function ModalCrearActividad({ visible, onClose, onCreated }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [duracion, setDuracion] = useState('');

  // "Escuchamos" estos tres campos
  const fecha   = Form.useWatch('fechaActividad', form);
  const inicio  = Form.useWatch('horaInicioActividad', form);
  const termino = Form.useWatch('horaTerminoActividad', form);

  // Cada vez que cambian fecha/inicio/termino, recalculamos
  useEffect(() => {
    if (inicio && termino) {
      const diff = termino.diff(inicio, 'minute');
      if (diff < 0) {
        setDuracion('Inválida');
      } else {
        const h = Math.floor(diff / 60);
        const m = diff % 60;
        setDuracion(`${h}h ${m}min`);
      }
    } else {
      setDuracion('');
    }
  }, [fecha, inicio, termino]);

  // Obtenemos la hora actual para el bloqueo dinámico
  const ahora = dayjs();
  const isHoy = fecha?.isSame(ahora, 'day');

  // Funciones de bloqueo
  const disabledHours = () =>
    isHoy
      ? Array.from({ length: ahora.hour() }, (_, i) => i)
      : [];
  const disabledMinutes = (hr) =>
    isHoy && hr === ahora.hour()
      ? Array.from({ length: ahora.minute() }, (_, i) => i)
      : [];

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // Calculamos el estado automáticamente
      const now = dayjs();
      const selectedDate = values.fechaActividad;
      const selectedStart = values.horaInicioActividad;
      const selectedDateTime = selectedDate
        .hour(selectedStart.hour())
        .minute(selectedStart.minute())
        .second(0);

      const diffMinutes = selectedDateTime.diff(now, 'minute');
      let idEstadoActividad;
      if (selectedDate.isSame(now, 'day') && Math.abs(diffMinutes) <= 1) {
        idEstadoActividad = 1; // En proceso
      } else {
        idEstadoActividad = 4; // Pendiente
      }

      const payload = {
        descripcionActividad:  values.descripcionActividad,
        tituloActividad:       values.tituloActividad,
        fechaActividad:        selectedDate.format('YYYY-MM-DD'),
        horaInicioActividad:   selectedStart.format('HH:mm:ss'),
        horaTerminoActividad:  values.horaTerminoActividad.format('HH:mm:ss'),
        ubicacionActividad:    values.ubicacionActividad,
        idEstadoActividad,
        idTipoActividad:       Number(values.idTipoActividad),
      };

      setLoading(true);
      await crearActividad(payload);
      message.success('Actividad creada exitosamente');
      form.resetFields();
      setDuracion('');
      if (onCreated) onCreated(payload);
      onClose();
    } catch (err) {
      if (!err.errorFields) {
        message.error(err.message || 'Ocurrió un error');
      }
    } finally {
      setLoading(false);
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
      destroyOnClose={true}
      className="modal-crear-actividad"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          idTipoActividad: 1,
        }}
      >
        <Form.Item
          name="tituloActividad"
          label="Título"
          rules={[
            { required: true, message: 'Ingresa un título' },
            { max: 25, message: 'El título no puede exceder 25 caracteres' },
          ]}
        >
          <Input maxLength={25} />
        </Form.Item>

        <Form.Item
          name="descripcionActividad"
          label="Descripción"
          rules={[
            { required: true, message: 'Ingresa una descripción' },
            { max: 50, message: 'La descripción no puede exceder 50 caracteres' },
          ]}
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
            disabledDate={d => d && d < ahora.startOf('day')}
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
            showNow
            disabledHours={disabledHours}
            disabledMinutes={disabledMinutes}
          />
        </Form.Item>

        <Form.Item
          name="horaTerminoActividad"
          label="Hora de término"
          dependencies={['horaInicioActividad']}
          rules={[
            { required: true, message: 'Selecciona la hora de término' },
            ({ getFieldValue }) => ({
              validator(_, val) {
                const ini = getFieldValue('horaInicioActividad');
                if (!ini || !val) return Promise.resolve();
                return val.isBefore(ini)
                  ? Promise.reject('La hora debe ser posterior al inicio')
                  : Promise.resolve();
              },
            }),
          ]}
        >
          <TimePicker
            locale={timeLocale}
            format="HH:mm"
            style={{ width: '100%' }}
            placeholder="Hora de término"
            showNow={false}
          />
        </Form.Item>

        <Form.Item label="Duración estimada">
          <Input value={duracion} disabled placeholder="—" />
        </Form.Item>

        <Form.Item
          name="ubicacionActividad"
          label="Ubicación"
          rules={[
            { required: true, message: 'Ingresa la ubicación' },
            { max: 40, message: 'La ubicación no puede exceder 40 caracteres' },
          ]}
        >
          <Input maxLength={40} />
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

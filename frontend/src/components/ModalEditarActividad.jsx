// src/components/ModalEditarActividad.jsx

import { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, TimePicker, message } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import dateLocale from 'antd/es/date-picker/locale/es_ES';
import timeLocale from 'antd/es/time-picker/locale/es_ES';
import { getActividadById, actualizarActividad } from '../services/actividad.service';

dayjs.locale('es');

const tipos = [
  { label: 'Sin venta', value: 1 },
  { label: 'Con venta', value: 2 },
];

export default function ModalEditarActividad({
  visible,
  actividadId,
  onClose,
  onUpdated
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [duracion, setDuracion] = useState('');
  const [actividadData, setActividadData] = useState(null);

  // 1) Al abrir, cargamos toda la actividad (incluyendo estado)
  useEffect(() => {
    if (visible && actividadId) {
      (async () => {
        try {
          const json = await getActividadById(actividadId);
          const data = json; // asumo json ya es data (ver tu servicio)
          setActividadData(data);

          // Rellenar form
          form.setFieldsValue({
            tituloActividad:      data.tituloActividad,
            descripcionActividad: data.descripcionActividad,
            fechaActividad:       dayjs(data.fechaActividad, 'YYYY-MM-DD'),
            horaInicioActividad:  dayjs(data.horaInicioActividad, 'HH:mm:ss'),
            horaTerminoActividad: dayjs(data.horaTerminoActividad, 'HH:mm:ss'),
            ubicacionActividad:   data.ubicacionActividad,
            idTipoActividad:      Number(data.idTipoActividad),
          });

          // Duración inicial
          const diff = dayjs(data.horaTerminoActividad, 'HH:mm:ss')
            .diff(dayjs(data.horaInicioActividad, 'HH:mm:ss'), 'minute');
          if (diff >= 0) {
            const h = Math.floor(diff / 60);
            const m = diff % 60;
            setDuracion(`${h}h ${m}min`);
          }
        } catch  {
          message.error('Error al cargar la actividad');
        }
      })();
    } else {
      // limpiar cuando se cierra
      form.resetFields();
      setActividadData(null);
      setDuracion('');
    }
  }, [visible, actividadId, form]);

  // 2) Recalcular duración al cambiar hora
  const fecha  = Form.useWatch('fechaActividad', form);
  const inicio = Form.useWatch('horaInicioActividad', form);
  const termino= Form.useWatch('horaTerminoActividad', form);
  useEffect(() => {
    if (inicio && termino) {
      const diff = termino.diff(inicio, 'minute');
      setDuracion(diff < 0
        ? 'Inválida'
        : `${Math.floor(diff/60)}h ${diff%60}min`
      );
    }
  }, [fecha, inicio, termino]);

  // 3) Deshabilitar horas/minutos pasados si es hoy
  const ahora = dayjs();
  const isHoy = fecha?.isSame(ahora, 'day');
  const disabledHours   = () => isHoy
    ? Array.from({length: ahora.hour()}, (_, i) => i)
    : [];
  const disabledMinutes = hr => isHoy && hr === ahora.hour()
    ? Array.from({length: ahora.minute()}, (_, i) => i)
    : [];

  // 4) Enviar PUT con todos los campos, incluyendo idEstadoActividad
  const handleOk = async () => {
    try {
      const vals = await form.validateFields();
      setLoading(true);

      const payload = {
        descripcionActividad:  vals.descripcionActividad,
        tituloActividad:       vals.tituloActividad.trim(),
        fechaActividad:        vals.fechaActividad.format('YYYY-MM-DD'),
        horaInicioActividad:   vals.horaInicioActividad.format('HH:mm:ss'),
        horaTerminoActividad:  vals.horaTerminoActividad.format('HH:mm:ss'),
        ubicacionActividad:    vals.ubicacionActividad,
        idTipoActividad:       Number(vals.idTipoActividad),
        idEstadoActividad:     Number(actividadData.idEstadoActividad),
      };

      await actualizarActividad(actividadId, payload);
      message.success('Actividad actualizada');
      onUpdated();
      onClose();
    } catch (err) {
      if (!err.errorFields) {
        message.error(err.message || 'Error al actualizar actividad');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Editar actividad"
      open={visible}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={loading}
      okText="Guardar"
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="tituloActividad"
          label="Título"
          rules={[
            { required: true, message: 'Ingresa un título' },
            { max: 25, message: 'Máximo 25 caracteres' }
          ]}
        >
          <Input maxLength={25} />
        </Form.Item>

        <Form.Item
          name="descripcionActividad"
          label="Descripción"
          rules={[
            { required: true, message: 'Ingresa una descripción' },
            { max: 50, message: 'Máximo 50 caracteres' }
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
            style={{ width: '100%' }}
            format="HH:mm"
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
              }
            })
          ]}
        >
          <TimePicker
            locale={timeLocale}
            style={{ width: '100%' }}
            format="HH:mm"
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
            { max: 40, message: 'Máximo 40 caracteres' }
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

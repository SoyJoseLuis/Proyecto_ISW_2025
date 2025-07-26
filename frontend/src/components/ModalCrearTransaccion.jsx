import { Modal, Form, Input, DatePicker, Select, InputNumber, message } from 'antd';
import dayjs from 'dayjs';
import { useCreateTransaccion } from '../hooks/transaccion/useCreateTransaccion';
import { useGetCurrentBalance } from '../hooks/balance/useGetCurrentBalance.jsx';

export default function ModalCrearTransaccion({ visible, onClose, onSuccess }) {
  const [form] = Form.useForm();
  const { createTransaccion, isLoading } = useCreateTransaccion();
  const { balance } = useGetCurrentBalance(false);

  // Tipos de transacción (según tu API)
  const tiposTransaccion = [
    { id: 1, nombre: 'Ingreso' },
    { id: 2, nombre: 'Salida' }
  ];



  // Función para validar que la fecha sea del año actual
  const validateFechaAñoActual = (_, value) => {
    if (!value) return Promise.resolve();
    
    const currentYear = dayjs().year();
    const selectedYear = value.year();
    
    if (selectedYear !== currentYear) {
      return Promise.reject(new Error(`La fecha debe ser del año actual (${currentYear})`));
    }
    return Promise.resolve();
  };

  // Función para deshabilitar fechas que no sean del año actual ni posteriores al día actual
  const disabledDate = (current) => {
    const today = dayjs();
    const currentYear = today.year();
    // Deshabilita si no es el año actual o si es después de hoy
    return (
      (current && current.year() !== currentYear) ||
      (current && current.isAfter(today, 'day'))
    );
  };

  // Validación personalizada para el monto según tipo de transacción y balance
  const validateMontoTransaccion = async (_, value) => {
    const tipo = form.getFieldValue('idTipoTransaccion');
    if (value && value <= 0) {
      return Promise.reject(new Error('El monto debe ser mayor a cero'));
    }
    if (tipo === 2 && balance && value > balance.montoActual) {
      return Promise.reject(new Error(`No hay fondos suficientes. El balance disponible es $${balance.montoActual.toLocaleString('es-CL')}`));
    }
    return Promise.resolve();
  };

  const handleSubmit = async (values) => {
    try {
      // Obtener RUT desde localStorage
      let rut = '';
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        rut = userData?.student?.rutEstudiante || '';
      } catch {
        rut = '';
      }
      if (!rut) {
        message.error("No se encontró usuario logueado.");
        return;
      }
      // Validación extra por si el usuario manipula el DOM
      if (values.idTipoTransaccion === 2 && balance && values.montoTransaccion > balance.montoActual) {
        message.error(`No hay fondos suficientes. El balance disponible es $${balance.montoActual.toLocaleString('es-CL')}`);
        return;
      }
      const transaccionData = {
        montoTransaccion: values.montoTransaccion,
        fechaTransaccion: values.fechaTransaccion.format('DD-MM-YYYY'),
        rutEstudiante: rut, // Usar el rut obtenido
        idTipoTransaccion: values.idTipoTransaccion,
        motivoTransaccion: values.motivoTransaccion,
        idActividad: values.idActividad || null
      };

      await createTransaccion(transaccionData);
      form.resetFields();
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error al crear transacción:', error);
    }
  };

  return (
    <Modal
      open={visible}
      title="Crear nueva transacción"
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Crear"
      cancelText="Cancelar"
      centered
      destroyOnClose
      confirmLoading={isLoading}
    >
      <Form
        form={form}
        layout="vertical"
        name="crear_transaccion_form"
        onFinish={handleSubmit}
        style={{ marginTop: 8 }}
      >
        <Form.Item 
          label="Tipo de transacción" 
          name="idTipoTransaccion"
          rules={[{ required: true, message: 'Selecciona el tipo de transacción' }]}
        >
          <Select placeholder="Selecciona tipo">
            {tiposTransaccion.map(t => (
              <Select.Option key={t.id} value={t.id}>{t.nombre}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item 
          label="Monto" 
          name="montoTransaccion"
          rules={[
            { required: true, message: 'Ingresa el monto' },
            { validator: validateMontoTransaccion }
          ]}
        >
          <InputNumber
            placeholder="Ingresa el monto"
            style={{ width: '100%' }}
            min={0.01}
            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item 
          label="Fecha de transacción" 
          name="fechaTransaccion"
          rules={[
            { required: true, message: 'Selecciona la fecha' },
            { validator: validateFechaAñoActual }
          ]}
        >
          <DatePicker 
            format="DD-MM-YYYY" 
            style={{ width: '100%' }} 
            placeholder="Seleccionar fecha"
            disabledDate={disabledDate}
          />
        </Form.Item>

        <Form.Item 
          label="Motivo de la transacción" 
          name="motivoTransaccion"
          rules={[
            { required: true, message: 'Describe el motivo' },
            { min: 15, message: 'El motivo debe tener al menos 15 caracteres' },
            { max: 70, message: 'El motivo no puede exceder 70 caracteres' }
          ]}
          style={{ marginBottom: 32 }}
        >
          <Input.TextArea 
            placeholder="Describe el motivo de la transacción" 
            rows={2} 
            maxLength={70}
            showCount
          />
        </Form.Item>

        {/* Texto informativo sobre eliminación */}
        <div style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: '#f6ffed',
          border: '1px solid #b7eb8f',
          borderRadius: '6px',
          fontSize: '13px',
          color: '#52c41a'
        }}>
          <strong>💡 Información:</strong> Podrás eliminar esta transacción únicamente durante los primeros 5 minutos después de crearla.
        </div>
      </Form>
      
    </Modal>
  );
} 
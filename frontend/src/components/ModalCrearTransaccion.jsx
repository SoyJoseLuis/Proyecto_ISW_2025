import { Modal, Form, Input, DatePicker, Select, InputNumber } from 'antd';
import dayjs from 'dayjs';
import { useCreateTransaccion } from '../hooks/transaccion/useCreateTransaccion';

export default function ModalCrearTransaccion({ visible, onClose, onSuccess }) {
  const [form] = Form.useForm();
  const { createTransaccion, isLoading } = useCreateTransaccion();

  // Tipos de transacción (según tu API)
  const tiposTransaccion = [
    { id: 1, nombre: 'Ingreso' },
    { id: 2, nombre: 'Salida' }
  ];

  // Función para validar formato RUT
  const validateRUT = (_, value) => {
    if (!value) return Promise.resolve();
    
    const rutRegex = /^\d{7,8}-[\dkK]$/;
    if (!rutRegex.test(value)) {
      return Promise.reject(new Error('El formato del RUT debe ser XXXXXXXX-X (ej: 12345678-9)'));
    }
    return Promise.resolve();
  };

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

  // Función para deshabilitar fechas que no sean del año actual
  const disabledDate = (current) => {
    const currentYear = dayjs().year();
    return current && current.year() !== currentYear;
  };

  const handleSubmit = async (values) => {
    try {
      const transaccionData = {
        montoTransaccion: values.montoTransaccion,
        fechaTransaccion: values.fechaTransaccion.format('DD-MM-YYYY'),
        rutEstudiante: values.rutEstudiante,
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
            { 
              validator: (_, value) => {
                if (value && value <= 0) {
                  return Promise.reject(new Error('El monto debe ser mayor a cero'));
                }
                return Promise.resolve();
              }
            }
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
          label="RUT del estudiante" 
          name="rutEstudiante"
          rules={[
            { required: true, message: 'Ingresa el RUT del estudiante' },
            { validator: validateRUT }
          ]}
        >
          <Input placeholder="Ej: 21332767-4" maxLength={12} />
        </Form.Item>

        <Form.Item 
          label="Motivo de la transacción" 
          name="motivoTransaccion"
          rules={[
            { required: true, message: 'Describe el motivo' },
            { min: 15, message: 'El motivo debe tener al menos 15 caracteres' },
            { max: 70, message: 'El motivo no puede exceder 70 caracteres' }
          ]}
        >
          <Input.TextArea 
            placeholder="Describe el motivo de la transacción" 
            rows={2} 
            maxLength={70}
            showCount
          />
        </Form.Item>

        <Form.Item 
          label="ID de actividad (opcional)" 
          name="idActividad"
        >
          <InputNumber
            placeholder="ID de actividad relacionada"
            style={{ width: '100%' }}
            min={1}
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
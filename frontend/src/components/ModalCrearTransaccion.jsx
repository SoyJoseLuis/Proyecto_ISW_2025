import { Modal, Form, Input, DatePicker, Select, InputNumber } from 'antd';
import { useCreateTransaccion } from '../hooks/transaccion/useCreateTransaccion';

export default function ModalCrearTransaccion({ visible, onClose, onSuccess }) {
  const [form] = Form.useForm();
  const { createTransaccion, isLoading } = useCreateTransaccion();

  // Tipos de transacción (según tu API)
  const tiposTransaccion = [
    { id: 1, nombre: 'Ingreso' },
    { id: 2, nombre: 'Egreso' }
  ];

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
          rules={[{ required: true, message: 'Ingresa el monto' }]}
        >
          <InputNumber
            placeholder="Ingresa el monto"
            style={{ width: '100%' }}
            min={0}
            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item 
          label="Fecha de transacción" 
          name="fechaTransaccion"
          rules={[{ required: true, message: 'Selecciona la fecha' }]}
        >
          <DatePicker format="DD-MM-YYYY" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item 
          label="RUT del estudiante" 
          name="rutEstudiante"
          rules={[{ required: true, message: 'Ingresa el RUT del estudiante' }]}
        >
          <Input placeholder="Ej: 21332767-4" maxLength={12} />
        </Form.Item>

        <Form.Item 
          label="Motivo de la transacción" 
          name="motivoTransaccion"
          rules={[{ required: true, message: 'Describe el motivo' }]}
        >
          <Input.TextArea 
            placeholder="Describe el motivo de la transacción" 
            rows={2} 
            maxLength={255} 
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
      </Form>
    </Modal>
  );
} 
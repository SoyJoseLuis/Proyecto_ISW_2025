import { Modal, Form, Input, InputNumber } from 'antd';
import useCreateMeta from '../hooks/metaf/useCreateMeta.jsx';

export default function ModalCrearMetaFinanciera({ visible, onClose, onMetaCreated }) {
  const [form] = Form.useForm();
  const { loading, handleCreateMeta } = useCreateMeta(onMetaCreated);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const result = await handleCreateMeta(values);
      
      if (result.success) {
        form.resetFields();
        onClose();
      }
    } catch (error) {
      console.error('Error en validación del formulario:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={visible}
      title="Crear nueva meta financiera"
      onCancel={handleCancel}
      onOk={handleSubmit}
      okText="Crear"
      cancelText="Cancelar"
      centered
      destroyOnClose
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        name="crear_meta_financiera_form"
        style={{ marginTop: 8 }}
      >
        <Form.Item 
          label="Monto de la meta financiera" 
          name="metaFinanciera"
          rules={[
            { required: true, message: 'El monto es requerido' },
            { type: 'number', min: 1, message: 'El monto debe ser mayor a 0' }
          ]}
        >
          <InputNumber
            placeholder="Ingresa el monto objetivo"
            style={{ width: '100%' }}
            min={0}
            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item 
          label="Descripción de la meta" 
          name="descripcionMeta"
          rules={[
            { required: true, message: 'La descripción es requerida' },
            { max: 200, message: 'La descripción no puede exceder 200 caracteres' }
          ]}
        >
          <Input.TextArea 
            placeholder="Describe la meta financiera y su propósito" 
            rows={3} 
            maxLength={200} 
          />
        </Form.Item>
      </Form>
    </Modal>
  );
} 
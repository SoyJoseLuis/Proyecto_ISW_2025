import { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Alert } from 'antd';
import useCreateMeta from '../hooks/metaf/useCreateMeta.jsx';
import { getMetasByYear } from '../services/metaf.service.js';
import '../styles/ModalCrearMetaFinanciera.css';

export default function ModalCrearMetaFinanciera({ visible, onClose, onMetaCreated }) {
  const [form] = Form.useForm();
  const [existingMeta, setExistingMeta] = useState(false);
  const [checkingMeta, setCheckingMeta] = useState(false);
  const { loading, handleCreateMeta } = useCreateMeta(onMetaCreated);

  useEffect(() => {
    const checkExistingMeta = async () => {
      if (!visible) return;
      
      setCheckingMeta(true);
      try {
        const currentYear = new Date().getFullYear();
        const response = await getMetasByYear(currentYear);
        
        if (response.status === 'Success' && response.data && response.data.length > 0) {
          setExistingMeta(true);
        } else {
          setExistingMeta(false);
        }
      } catch (error) {
        console.error('Error al verificar meta existente:', error);
        setExistingMeta(false);
      } finally {
        setCheckingMeta(false);
      }
    };

    if (visible) {
      checkExistingMeta();
    }
  }, [visible]);

  const handleSubmit = async () => {
    // No permitir crear si ya existe una meta para el año actual
    if (existingMeta) {
      return;
    }
    
    try {
      const values = await form.validateFields();
      const result = await handleCreateMeta(values);
      
      if (result.success) {
        form.resetFields();
        setExistingMeta(false);
        setCheckingMeta(false);
        onClose();
      }
    } catch (error) {
      console.error('Error en validación del formulario:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setExistingMeta(false);
    setCheckingMeta(false);
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
      confirmLoading={loading || checkingMeta}
      okButtonProps={{ disabled: existingMeta || checkingMeta }}
      className="modal-crear-meta"
    >
      {existingMeta && (
        <Alert
          message="Meta financiera ya existe"
          description={`Ya existe una meta financiera registrada para el año ${new Date().getFullYear()}. Solo se permite una meta por año.`}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      
      {checkingMeta && (
        <Alert
          message="Verificando..."
          description="Verificando si ya existe una meta financiera para este año."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      
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
            { 
              type: 'number', 
              min: 50000, 
              message: '-' 
            },
            {
              validator: (_, value) => {
                if (value && value < 50000) {
                  return Promise.reject(new Error('El monto debe ser mayor o igual a $50.000'));
                }
                return Promise.resolve();
              }
            }
          ]}
        >
          <InputNumber
            placeholder="Ingresa el monto objetivo (mín. $50.000)"
            style={{ width: '100%' }}
            min={1}
            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item 
          label="Descripción de la meta" 
          name="descripcionMeta"
          rules={[
            { required: true, message: 'La descripción es requerida' },
            { min: 10, message: 'La descripción debe tener al menos 10 caracteres' },
            { max: 120, message: 'La descripción no puede exceder 120 caracteres' },
            {
              validator: (_, value) => {
                if (value) {
                  if (!/\S+\s+\S+/.test(value.trim())) {
                    return Promise.reject(new Error('La descripción debe contener al menos dos palabras.'));
                  }
                }
                return Promise.resolve();
              }
            }
          ]}
          style={{ marginBottom: 32 }} 
        >
          <Input.TextArea 
            placeholder="Describe la meta financiera y su propósito (mín. 10 caracteres)" 
            rows={3} 
            maxLength={120}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  );
} 
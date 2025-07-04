import { Modal, Form, Input, DatePicker, Select, InputNumber } from 'antd';

export default function ModalCrearMetaFinanciera({ visible, onClose }) {
  // Opciones para los select de metas financieras
  const tiposMeta = [
    { id: 1, nombre: 'Ahorro' },
    { id: 2, nombre: 'Inversión' },
    { id: 3, nombre: 'Equipamiento' },
    { id: 4, nombre: 'Eventos' }
  ];
  
  const prioridades = [
    { id: 1, nombre: 'Alta' },
    { id: 2, nombre: 'Media' },
    { id: 3, nombre: 'Baja' }
  ];

  const estados = [
    { id: 1, nombre: 'Activa' },
    { id: 2, nombre: 'En progreso' },
    { id: 3, nombre: 'Completada' },
    { id: 4, nombre: 'Pausada' }
  ];

  return (
    <Modal
      open={visible}
      title="Crear nueva meta financiera"
      onCancel={onClose}
      onOk={onClose}
      okText="Crear"
      cancelText="Cancelar"
      centered
      destroyOnClose
    >
      <Form
        layout="vertical"
        name="crear_meta_financiera_form"
        style={{ marginTop: 8 }}
      >
        <Form.Item label="Nombre de la meta" name="NOMBRE_META">
          <Input placeholder="Ej: Compra de equipos audiovisuales" maxLength={50} />
        </Form.Item>

        <Form.Item label="Monto objetivo" name="MONTO_OBJETIVO">
          <InputNumber
            placeholder="Monto que deseas alcanzar"
            style={{ width: '100%' }}
            min={0}
            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item label="Monto actual" name="MONTO_ACTUAL">
          <InputNumber
            placeholder="Monto ya reunido (opcional)"
            style={{ width: '100%' }}
            min={0}
            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item label="Fecha límite" name="FECHA_LIMITE">
          <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Tipo de meta" name="ID_TIPO_META">
          <Select placeholder="Selecciona tipo">
            {tiposMeta.map(t => (
              <Select.Option key={t.id} value={t.id}>{t.nombre}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Prioridad" name="ID_PRIORIDAD">
          <Select placeholder="Selecciona prioridad">
            {prioridades.map(p => (
              <Select.Option key={p.id} value={p.id}>{p.nombre}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Estado" name="ID_ESTADO">
          <Select placeholder="Selecciona estado">
            {estados.map(e => (
              <Select.Option key={e.id} value={e.id}>{e.nombre}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Descripción" name="DESCRIPCION_META">
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
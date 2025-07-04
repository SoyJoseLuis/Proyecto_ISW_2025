import { Modal, Form, Input, DatePicker, Select, InputNumber } from 'antd';

export default function ModalCrearTransaccion({ visible, onClose }) {
  // Opciones para los select de transacciones
  const tiposTransaccion = [
    { id: 1, nombre: 'Ingreso' },
    { id: 2, nombre: 'Egreso' }
  ];
  
  const categorias = [
    { id: 1, nombre: 'Eventos' },
    { id: 2, nombre: 'Materiales' },
    { id: 3, nombre: 'Servicios' },
    { id: 4, nombre: 'Otros' }
  ];

  const metodosPago = [
    { id: 1, nombre: 'Efectivo' },
    { id: 2, nombre: 'Transferencia' },
    { id: 3, nombre: 'Tarjeta' }
  ];

  return (
    <Modal
      open={visible}
      title="Crear nueva transacción"
      onCancel={onClose}
      onOk={onClose}
      okText="Crear"
      cancelText="Cancelar"
      centered
      destroyOnClose
    >
      <Form
        layout="vertical"
        name="crear_transaccion_form"
        style={{ marginTop: 8 }}
      >
        <Form.Item label="Tipo de transacción" name="TIPO_TRANSACCION">
          <Select placeholder="Selecciona tipo">
            {tiposTransaccion.map(t => (
              <Select.Option key={t.id} value={t.id}>{t.nombre}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Monto" name="MONTO_TRANSACCION">
          <InputNumber
            placeholder="Ingresa el monto"
            style={{ width: '100%' }}
            min={0}
            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item label="Descripción" name="DESCRIPCION_TRANSACCION">
          <Input.TextArea 
            placeholder="Describe la transacción" 
            rows={2} 
            maxLength={100} 
          />
        </Form.Item>

        <Form.Item label="Fecha" name="FECHA_TRANSACCION">
          <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Categoría" name="ID_CATEGORIA">
          <Select placeholder="Selecciona categoría">
            {categorias.map(c => (
              <Select.Option key={c.id} value={c.id}>{c.nombre}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Método de pago" name="ID_METODO_PAGO">
          <Select placeholder="Selecciona método">
            {metodosPago.map(m => (
              <Select.Option key={m.id} value={m.id}>{m.nombre}</Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Comprobante/Referencia" name="REFERENCIA">
          <Input placeholder="Número de comprobante o referencia" maxLength={50} />
        </Form.Item>
      </Form>
    </Modal>
  );
} 
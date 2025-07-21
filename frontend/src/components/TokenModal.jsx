// src/components/TokenModal.jsx

import { Modal } from 'antd';

export default function TokenModal({ visible, token, onClose }) {
  return (
    <Modal
      title="Token de Asistencia"
      visible={visible}
      onOk={onClose}
      onCancel={onClose}
      okText="Cerrar"
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <p style={{ fontSize: 24, textAlign: 'center' }}>{token}</p>
    </Modal>
  );
}

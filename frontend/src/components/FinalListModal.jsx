// src/components/FinalListModal.jsx

import { Modal, List } from 'antd';

export default function FinalListModal({ visible, list = [], onClose }) {
  return (
    <Modal
      title="Lista definitiva"
      visible={visible}
      onOk={onClose}
      onCancel={onClose}
      okText="Cerrar"
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <List
        dataSource={list}
        renderItem={f => (
          <List.Item key={f.rutEstudiante}>
            {f.estudiante.nombreEstudiante}
          </List.Item>
        )}
      />
    </Modal>
  );
}

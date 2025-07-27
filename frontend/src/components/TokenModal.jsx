// src/components/TokenModal.jsx
import { Modal, Typography } from 'antd';

const { Title, Text } = Typography;

export default function TokenModal({ visible, token, onClose }) {
  return (
    <Modal
      open={visible}
      centered
      width={500}
      onCancel={onClose}
      footer={null}
      bodyStyle={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 40,
      }}
    >
      <Title level={3} style={{ marginBottom: 24 }}>
        Token de Asistencia
      </Title>
      <Text
        style={{
          fontSize: 64,
          fontWeight: 'bold',
          color: '#1890ff',
        }}
      >
        {token}
      </Text>
    </Modal>
  );
}

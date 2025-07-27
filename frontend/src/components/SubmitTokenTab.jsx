// src/components/SubmitTokenTab.jsx
import { useState } from 'react';
import { Input, Button, Typography, Space, notification, Card } from 'antd';
import { useSubmitToken } from '../hooks/asistencia/useSubmitToken';
import { getStoredUserData } from '../helpers/auth.js';
import '../styles/SubmitTokenTab.css';

const { Title, Text } = Typography;

export default function SubmitTokenTab() {
  const [code, setCode] = useState('');
  const { send, loading } = useSubmitToken();

  // Sacamos el nombre del estudiante de lo que guardaste en login
  const student = getStoredUserData();
  const studentName =
    student?.nombreEstudiante ||
    student?.rutEstudiante ||
    'Estudiante';

  const onSubmit = async () => {
    if (code.trim().length !== 4) {
      return notification.warning({
        message: 'Token inválido',
        description: 'Debes ingresar un token de 4 dígitos',
      });
    }
    try {
      await send(code);
      notification.success({
        message: 'Asistencia registrada',
        description: 'El token se envió correctamente.',
      });
      setCode('');
    } catch {
      // El interceptor o el hook ya maneja errores
    }
  };

  return (
    <Card
      bordered={false}
      style={{
        maxWidth: 360,
        margin: '0 auto',
        background: 'rgba(24, 144, 255, 0.05)',
        borderRadius: 8,
        padding: 24,
      }}
    >
      <div className="submit-token-container">
        <Space
          direction="vertical"
          size="large"
          align="center"
          style={{ width: '100%' }}
        >
          <Title level={4} style={{ color: '#1890ff', margin: 0 }}>
            ¡Hola, {studentName}!
          </Title>
          <Text>Ingresa el token de la actividad:</Text>
          <Input
            className="submit-token-input"
            placeholder="0000"
            maxLength={4}
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
            disabled={loading}
          />
          <Button
            className="submit-token-button"
            type="primary"
            size="large"
            loading={loading}
            disabled={code.length !== 4}
            onClick={onSubmit}
          >
            Enviar Token
          </Button>
        </Space>
      </div>
    </Card>
  );
}

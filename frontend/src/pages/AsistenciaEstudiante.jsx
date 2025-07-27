// src/pages/AsistenciaEstudiante.jsx
import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftOutlined,
  UserOutlined,
  IdcardOutlined,
} from '@ant-design/icons';
import { Input, Typography, Button, Card, notification } from 'antd';
import { submitTokenGlobal } from '../services/asistencia.service.js';
import { getStoredUserData } from '../helpers/auth.js';
import '../styles/AsistenciaEstudiante.css';

const { Title, Text } = Typography;

export default function AsistenciaEstudiante() {
  const navigate = useNavigate();
  const student = getStoredUserData();
  const studentName =
    student?.nombreEstudiante ||
    student?.rutEstudiante ||
    'Estudiante';
  const runStudent = student?.rutEstudiante || '';

  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (token.length !== 4) {
      return notification.warning({
        message: 'Token inválido',
        description: 'El token debe tener 4 dígitos numéricos',
      });
    }
    setLoading(true);
    try {
      const msg = await submitTokenGlobal(token);
      notification.success({
        message: '¡Asistencia enviada!',
        description: msg,
      });
      setToken('');
    } catch {
      // interceptor muestra el error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="asistencia-estudiante">
      <div className="asistencia-container">
        <header className="asistencia-header">
          <ArrowLeftOutlined
            className="asistencia-back"
            onClick={() => navigate('/home-estudiante')}
          />
          <Title level={2} className="asistencia-title">
            Registrar Asistencia
          </Title>
        </header>

        <Card className="asistencia-card" bordered={false}>
          <UserOutlined className="asistencia-avatar" />
          <Title level={4} className="asistencia-student-name">
            ¡Hola, {studentName}!
          </Title>
          <Text className="asistencia-student-run">
            <IdcardOutlined /> {runStudent}
          </Text>
        </Card>

        <div className="asistencia-input-wrapper">
          <Input
            placeholder="Código de 4 dígitos"
            size="large"
            className="asistencia-input"
            value={token}
            onChange={e => setToken(e.target.value.replace(/\D/g, ''))}
            maxLength={4}
            disabled={loading}
          />
          <Button
            type="primary"
            size="large"
            className="asistencia-submit"
            loading={loading}
            disabled={token.length !== 4}
            onClick={handleSubmit}
          >
            Enviar Token
          </Button>
        </div>
      </div>
    </div>
  );
}

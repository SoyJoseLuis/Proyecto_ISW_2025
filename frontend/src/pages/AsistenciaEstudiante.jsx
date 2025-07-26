// src/pages/AsistenciaEstudiante.jsx
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Input, Typography, Button, Card } from 'antd';
import '../styles/AsistenciaEstudiante.css';

const { Title, Text } = Typography;

export default function AsistenciaEstudiante() {
  const navigate = useNavigate();

  return (
    <div className="asistencia-estudiante">
      <header className="asistencia-header">
        <ArrowLeftOutlined
          className="asistencia-back"
          onClick={() => navigate('/home-estudiante')}
        />
        <Title level={4} className="asistencia-title">
          Registrar Asistencia
        </Title>
      </header>

      {/* Card mostrando estudiante y actividad */}
      <Card className="asistencia-card">
        <Text strong>Estudiante:</Text> <Text className="asistencia-info">Nombre Estudiante</Text>
        <br />
        <Text strong>Actividad:</Text> <Text className="asistencia-info">Nombre de Actividad</Text>
      </Card>

      {/* Input y botón */}
      <div className="asistencia-input-wrapper">
        <Input
          placeholder="Ingresa token de asistencia"
          size="large"
          bordered={false}
          className="asistencia-input"
        />
        <Button type="primary" block className="asistencia-submit">
          Enviar Token
        </Button>
      </div>
    </div>
  );
}
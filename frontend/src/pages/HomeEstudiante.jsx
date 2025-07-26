import { Card, Row, Col, Typography } from 'antd';
import {
  CalendarOutlined,
  TeamOutlined,
  BellOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../styles/HomeEstudiante.css';

const { Title } = Typography;

export default function HomeEstudiante() {
  const navigate = useNavigate();
  const options = [
    {
      icon: <CalendarOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
      label: 'Calendario',
      path: '/calendario-estudiante'
    },
    {
      icon: <TeamOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
      label: 'Asistencia',
      path: '/asistencia-estudiante'
    },
    {
      icon: <BellOutlined style={{ fontSize: 32, color: '#faad14' }} />,
      label: 'Notificaciones',
      path: '/notificaciones-estudiante'
    }
  ];

  return (
    <div className="home-estudiante">
      <Title level={3} className="home-estudiante-title">
        Bienvenido
      </Title>
      <Row gutter={[16, 16]} className="home-estudiante-grid">
        {options.map(opt => (
          <Col span={24} key={opt.label}>
            <Card
              hoverable
              className="home-estudiante-card"
              onClick={() => navigate(opt.path)}
            >
              <div className="home-estudiante-card-content">
                {opt.icon}
                <span className="home-estudiante-card-label">{opt.label}</span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
);
}

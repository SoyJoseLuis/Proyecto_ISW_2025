import { Row, Col } from 'antd';
import MetaFinancieraHome from '../components/MetaFinancieraHome';

export default function Home() {
  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '24px' }}>📊 Bienvenido al Dashboard</h2>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={24} md={12} lg={8} xl={8}>
          <MetaFinancieraHome />
        </Col>
        
        <Col xs={24} sm={24} md={12} lg={16} xl={16}>
          <div style={{ 
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            height: '100%'
          }}>
            <h3>Resumen del Sistema</h3>
            <p>
              Esta es tu página principal. Aquí se muestra el progreso de la meta financiera del año en curso,
              junto con información relevante del sistema.
            </p>
            <p>
              Utiliza la barra lateral de navegación para acceder a las diferentes secciones del sistema.
            </p>
          </div>
        </Col>
      </Row>
    </div>
  );
}

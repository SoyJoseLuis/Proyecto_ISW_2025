// src/pages/CalendarioEstudiante.jsx
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import CalendarioActividades from '../components/CalendarioActividades';
import '../styles/StudentPages.css';

const { Title } = Typography;

export default function CalendarioEstudiante() {
  const navigate = useNavigate();

  return (
    <div className="student-page">
      <header className="student-page-header">
        <ArrowLeftOutlined
          className="student-back-icon"
          onClick={() => navigate('/home-estudiante')}
        />
        <Title level={3} className="student-page-title">
          Calendario
        </Title>
      </header>
      <CalendarioActividades />
    </div>
  );
}

// src/pages/Asistencia.jsx
import  { useState, useEffect } from 'react';
import DashboardTabs from '../components/DashboardTabs';
import SubmitTokenTab from '../components/SubmitTokenTab';
import ActivitiesControlTable from '../components/ActivitiesControlTable';
import { CheckCircleOutlined, KeyOutlined } from '@ant-design/icons';
import { getStoredUserData } from '../helpers/auth.js';

const BASE_URL =
  import.meta.env.VITE_BASE_URL ||
  'http://localhost:4000/api';

export default function Asistencia() {
  // 1) Obtenemos el RUT del estudiante
  const student = getStoredUserData();
  const rut     = student?.rutEstudiante;

  // 2) Estado para los roles y loading
  const [roles, setRoles]         = useState([]);
  const [loadingRoles, setLoading] = useState(true);

  // 3) Fetch a /roles/estudiante/:rut
  useEffect(() => {
    if (!rut) {
      setLoading(false);
      return;
    }
    fetch(`${BASE_URL}/roles/estudiante/${rut}`)
      .then(res => res.json())
      .then(data => {
        if (
          data.status === 'Success' &&
          Array.isArray(data.data.roles)
        ) {
          // extraemos los idRol como strings o números
          setRoles(data.data.roles.map(r => r.idRol));
        } else {
          setRoles([]);
        }
      })
      .catch(() => setRoles([]))
      .finally(() => setLoading(false));
  }, [rut]);

  // 4) Mientras carga roles, no renderizamos nada
  if (loadingRoles) return null;

  // 5) Comprobamos si es Tesorero (idRol "1")
  const isTesorero = roles.includes('1') || roles.includes(1);

  // 6) Definimos nuestras pestañas
  const tabs = [
    {
      key: '1',
      label: (
        <>
          <CheckCircleOutlined
            style={{ color: '#1890ff', marginRight: 4 }}
          />
          Sala de control
        </>
      ),
      content: <ActivitiesControlTable />,
    },
    {
      key: '2',
      label: (
        <>
          <KeyOutlined
            style={{ color: '#1890ff', marginRight: 4 }}
          />
          Enviar token
        </>
      ),
      content: <SubmitTokenTab />,
    },
  ];

  // 7) Si es Tesorero, ocultamos la pestaña "Sala de control"
  const visibleTabs = isTesorero
    ? tabs.filter(tab => tab.key === '2')
    : tabs;

  return <DashboardTabs tabs={visibleTabs} />;
}

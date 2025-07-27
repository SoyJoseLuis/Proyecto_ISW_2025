
 import DashboardTabs from '../components/DashboardTabs';
 import SubmitTokenTab from '../components/SubmitTokenTab';
 import ActivitiesControlTable from '../components/ActivitiesControlTable';
 import '../styles/Actividades.css';
 import { CheckCircleOutlined, KeyOutlined } from '@ant-design/icons';
import { getUserFromJwt } from '../helpers/auth.js';

 export default function Asistencia() {
const payload = getUserFromJwt() || {};
// Si guardaste idRol en el JWT:
const isTesorero = payload.idRol === 1;
// O si guardaste role como texto:
// const isTesorero = payload.role === 'Tesorero';

   const tabs = [
     {
       key: '1',
      label: (<><CheckCircleOutlined style={{ color: '#1890ff', marginRight: 4 }}/>Sala de control</>),
       content: <ActivitiesControlTable />
     },
     {
            key: '2',
     label: (<><KeyOutlined style={{ color: '#1890ff', marginRight: 4 }}/>Enviar token</>),
             content: <SubmitTokenTab />

     },

   ];
     // Si es Tesorero, solo mostramos la pestaña 2
  const visibleTabs = isTesorero
    ? tabs.filter(tab => tab.key === '2')
    : tabs;


  return <DashboardTabs tabs={visibleTabs} />;
   //return <DashboardTabs tabs={tabs} />;
 }

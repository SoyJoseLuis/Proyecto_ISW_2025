
 import DashboardTabs from '../components/DashboardTabs';
 import SubmitTokenTab from '../components/SubmitTokenTab';
 import ActivitiesControlTable from '../components/ActivitiesControlTable';
 import '../styles/Actividades.css';
 import { CheckCircleOutlined, KeyOutlined } from '@ant-design/icons';

 export default function Asistencia() {
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
   return <DashboardTabs tabs={tabs} />;
 }

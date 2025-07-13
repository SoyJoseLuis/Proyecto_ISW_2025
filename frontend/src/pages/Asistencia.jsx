
 import DashboardTabs from '../components/DashboardTabs';
 import SubmitTokenTab from '../components/SubmitTokenTab';
 import ActivitiesControlTable from '../components/ActivitiesControlTable';
 import '../styles/Actividades.css';

 export default function Asistencia() {
   const tabs = [
     {
       key: '1',
       label: 'Sala de control',
       content: <ActivitiesControlTable />
     },
     {
            key: '2',
            label: 'Enviar token',
             content: <SubmitTokenTab />

     },

   ];
   return <DashboardTabs tabs={tabs} />;
 }

 import React from 'react';
 import DashboardTabs from '../components/DashboardTabs';
import ActividadesTokenTable from '../components/ActividadesTokenTable';
 import SubmitTokenTab from '../components/SubmitTokenTab';
 import '../styles/Actividades.css';

 export default function Asistencia() {
   const tabs = [
     {
       key: '1',
       label: 'Control de tokens',
       content: <ActividadesTokenTable />
     },
     {
            key: '2',
            label: 'Enviar token',
             content: <SubmitTokenTab />

     },
     // …otras pestañas (pendientes, listado)
   ];
   return <DashboardTabs tabs={tabs} />;
 }

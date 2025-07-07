
import DashboardTabs      from "../components/DashboardTabs";
import GenerateTokenTab   from "../components/GenerarTokenTab";
//import SubmitTokenTab     from "../components/EnviarTokenTab";
//import PendingList        from "../components/TokensPendientesList";
//import AttendanceList     from "../components/ListadoFinal";
//import "../styles/Actividades.css";

export default function Asistencia() {
  const tabs = [
    {
      key: "1",
      label: "Generar token",
      content: <GenerateTokenTab />
    },
    {
      key: "2",
      label: "Enviar token",
      //content: <SubmitTokenTab />
    },
    {
      key: "3",
      label: "Tokens pendientes",
      //content: <PendingList />
    },
    {
      key: "4",
      label: "Listado final",
      //content: <AttendanceList />
    }
  ];

  return (
    <div className="asistencia-page">
      <h2>Control de Asistencia</h2>
      <DashboardTabs tabs={tabs} />
    </div>
  );
}

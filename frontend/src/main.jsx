import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

// Páginas
import Login from '@pages/Login';
import HomeEstudiante from '@pages/HomeEstudiante';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Register from '@pages/Register';
import Asistencias from '@pages/Asistencia';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import Actividades from '@pages/Actividades';
import Finanzas from '@pages/Finanzas';
import Notificaciones from '@pages/Notificaciones';
import CalendarioPage from '@pages/CalendarioPage';

// **Importaciones nuevas**
import StudentLayout from '@components/StudentLayout';
import CalendarioEstudiante from '@pages/CalendarioEstudiante';
import AsistenciaEstudiante from '@pages/AsistenciaEstudiante';
import NotificacionesEstudiante from '@pages/NotificacionesEstudiante';

// Componentes
import ProtectedRoute from '@components/ProtectedRoute';

// Estilos globales
import '@styles/styles.css';
import '@styles/LoginScreen.css';

const router = createBrowserRouter([
  // Rutas “desktop” normales, con sidebar
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Root />
      </ProtectedRoute>
    ),
    errorElement: <Error404 />,
    children: [
      { index: true, element: <Navigate to="/auth" replace /> },
      { path: '/home', element: <Home /> },
      { path: '/actividades', element: <Actividades /> },
      { path: '/finanzas', element: <Finanzas /> },
      { path: '/asistencia', element: <Asistencias /> },
      { path: '/notificaciones', element: <Notificaciones /> },
      { path: '/calendario', element: <CalendarioPage /> },
      {
        path: '/users',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Users />
          </ProtectedRoute>
        )
      }
    ]
  },

  // Rutas “mobile-student” (sin sidebar)
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <StudentLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/home-estudiante', element: <HomeEstudiante /> },
      { path: '/calendario-estudiante', element: <CalendarioEstudiante /> },
      { path: '/asistencia-estudiante', element: <AsistenciaEstudiante /> },
      { path: '/notificaciones-estudiante', element: <NotificacionesEstudiante /> },
    ]
  },

  // Auth / Registro
  { path: '/auth', element: <Login /> },
  { path: '/register', element: <Register /> }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);

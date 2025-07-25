import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

// Páginas
import Login from '@pages/Login';
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

// Componentes
import ProtectedRoute from '@components/ProtectedRoute';

// Estilos globales
import '@styles/styles.css';
import '@styles/LoginScreen.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Root />
      </ProtectedRoute>
    ),
    errorElement: <Error404 />,
    children: [
      {
        index: true,
        element: <Navigate to="/auth" replace />
      },
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/actividades',
        element: <Actividades />
      },
      {
        path: '/finanzas',
        element: <Finanzas />
      },
      {
        path: '/asistencia',
        element: <Asistencias />
      },
      {
        path: '/notificaciones',
        element: <Notificaciones />
      },
      {
        path: '/calendario',
        element: <CalendarioPage />
      },
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
  {
    path: '/auth',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);

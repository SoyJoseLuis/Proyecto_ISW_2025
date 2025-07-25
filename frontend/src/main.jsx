import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Register from '@pages/Register';
import Asistencias from '@pages/Asistencia'; 
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import ProtectedRoute from '@components/ProtectedRoute';
import Actividades from '@pages/Actividades';      
import Finanzas from '@pages/Finanzas';
import '@styles/styles.css';  
import '@styles/LoginScreen.css';
import Notificaciones from '@pages/Notificaciones';
import CalendarioPage from '@pages/CalendarioPage'; 


const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        path: '/home',
        element: <Home />
      },
      {
        path: '/actividades',         
        element: <Actividades />
      },{
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
        path: '/users',
        element: (
          <ProtectedRoute allowedRoles={['administrador']}>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: '/calendario',
        element: <CalendarioPage />
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
  },
  
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);

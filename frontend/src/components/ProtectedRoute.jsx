import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  // Solo lee la bandera del login falso
  const isAuthenticated = localStorage.getItem('fake_isLogged') === '1';

  // Si NO está autenticado, manda a login
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  // Puedes eliminar la lógica de roles, o dejarla así para pruebas
  // const userRole = localStorage.getItem('fake_role'); // si quieres roles de prueba
  // if (allowedRoles && !allowedRoles.includes(userRole)) {
  //   return <Navigate to="/home" />;
  // }

  return children;
};

export default ProtectedRoute;

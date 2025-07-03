import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Root() {
  return (
    <PageRoot />
  );
}

function PageRoot() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="content-container">
        <div className="outlet-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

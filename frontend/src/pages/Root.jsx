import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ImageBar from '@components/ImageBar';

export default function Root() {
  return (
    <div className="app-container">
      <ImageBar />
      <Sidebar />
      <div className="content-container">
        <div className="outlet-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

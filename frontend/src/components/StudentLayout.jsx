// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Outlet } from 'react-router-dom';
import '../styles/StudentLayout.css';

export default function StudentLayout() {
  return (
    <div className="student-layout">
      <Outlet />
    </div>
  );
}

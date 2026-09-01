import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Dashboard/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FE] dark:bg-[#121212] flex transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;

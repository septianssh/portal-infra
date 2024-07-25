import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import Modal from '../Modal';
import useSessionTimeout from '../../../hooks/useSessionTimeout';

const Layout = () => {
  const { tokenExpiry } = useSelector(state => state.user.payload || {});
  const { showModal, setShowModal, remainingTime } = useSessionTimeout(tokenExpiry);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <Navbar />
        <div className="flex-grow overflow-y-auto">
          <div className="container mx-auto px-4 py-4">
            <Outlet />
          </div>
        </div>
      </div>
      <Modal open={showModal} setOpen={setShowModal} title="Session Timeout Warning">
        <div className="text-gray-900">
          Your session will expire in {remainingTime} seconds.
        </div>
      </Modal>
    </div>
  );
};

export default Layout;

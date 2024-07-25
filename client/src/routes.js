// src/routes.js
import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/common/Layout/Layout';
import Home from './pages/Home/Home';
import Signin from './pages/Signin/Signin';
import Admin from './pages/Admin/Admin';
import TaskHistory from './pages/TaskHistory/TaskHistory';
import AddRecordDNS from './pages/TaskList/Task1/AddRecordDNS';
import ProvisionVM from './pages/TaskList/Task2/ProvisionVM';
import DismantleVM from './pages/TaskList/Task3/DismantleVM';
import TabManager from './pages/TaskList/Task4/ProvisionVM';
import ProtectedRoute from './components/common/ProtectedRoute'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/',
            element: <Home />,
          },
          {
            path: '/task-history',
            element: <TaskHistory />,
          },
          {
            path: '/admin',
            element: <Admin />,
          },
          {
            path: '/tasks/add-record-dns',
            element: <AddRecordDNS />,
          },
          {
            path: '/tasks/provision-vm',
            element: <ProvisionVM />,
          },
          {
            path: '/tasks/dismantle-vm',
            element: <DismantleVM />,
          },
          {
            path: '/tasks/test1',
            element: <TabManager />,
          },
        ],
      },
    ],
  },
  {
    path: '/signin',
    element: <Signin />,
  },
]);

export default router;

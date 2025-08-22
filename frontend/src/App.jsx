import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import * as sessionActions from './store/session';
import Navigation from './components/Navigation';
import About from './components/About';
import GymClassList from './components/GymClassList';
import GymClassListAll from './components/GymClassListAll';
import GymDetail from './components/GymDetail';
import GymClassCreateForm from './components/GymClassCreateForm';
import GymClassEditForm from './components/GymClassEditForm';
import GymClassRegistered from './components/GymClassRegistered';
import GymMap from './components/GymMap'; 
import HomePage from './components/HomePage';
import RepairRequestList from './components/RepairRequestList';
import RepairRequestDetail from './components/RepairRequestDetail';
import UserMetricsDashboard from './components/UserMetricsDashboard';
import UserMetricsFormModal from './components/UserMetricsFormModal';




function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <HomePage />
      },
      {
        path: '/about',
        element: <About />
      },
      {
        path: '/classes',
        element: <GymClassList />
      },
      {
        path: '/classes/all',
        element: <GymClassListAll />
      },
      {
        path: '/my-classes',
        element: <GymClassRegistered />
      },
      {
        path: '/classes/new',
        element: <GymClassCreateForm />
      },
      {
        path: '/classes/:classId/edit',
        element: <GymClassEditForm />
      },
      {
        path: '/gyms', 
        element: <GymMap />
      },
      {
        path: '/gyms/:gymId', 
        element: <GymDetail />
      },
      {
        path: '/repair-requests',
        element: <RepairRequestList />
      },
      {
        path: '/repair-requests/:requestId',
        element: <RepairRequestDetail />
      },
      {
        path: '/repair-requests/new',
        element: <RepairRequestList />
      },
      {
        path: '/user-metrics',
        element: <UserMetricsDashboard />
      },
      {
        path: '/user-metrics/new',
        element: <UserMetricsFormModal />
      },

    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
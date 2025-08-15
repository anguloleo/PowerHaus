import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import * as sessionActions from './store/session';
import Navigation from './components/Navigation';
import GymClassList from './components/GymClassList';
import GymClassListAll from './components/GymClassListAll';
import GymClassRegistered from './components/GymClassRegistered';
import GymMap from './components/GymMap'; 
import GymDetail from './components/GymDetail';
import HomePage from './components/HomePage';
import RepairRequestList from './components/RepairRequestList';
import RepairRequestDetail from './components/RepairRequestDetail';



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

    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
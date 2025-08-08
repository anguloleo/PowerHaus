import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import * as sessionActions from './store/session';
import Navigation from './components/Navigation';
import GymClassList from './components/GymClassList';
import GymMap from './components/GymMap'; 
import GymDetail from './components/GymDetail';

import RepairRequestList from './components/RepairRequestList';
import RepairRequestForm from './components/RepairRequestForm';
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
        element: <h1>Welcome!</h1>
      },
      {
        path: '/classes',
        element: <GymClassList />
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
        path: '/repair-requests/new',
        element: <RepairRequestForm />
      },
      {
        path: '/repair-requests/:requestId',
        element: <RepairRequestDetail />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
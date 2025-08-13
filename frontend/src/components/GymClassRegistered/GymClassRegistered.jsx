import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClassRegistrations } from '../../store/classRegistration';
import { fetchGymClasses } from '../../store/gymClasses';

const GymClassRegistered = () => {
  const dispatch = useDispatch();

  // Load registrations and gym classes on mount
  useEffect(() => {
    dispatch(fetchClassRegistrations());
    dispatch(fetchGymClasses());
  }, [dispatch]);

  // Select registrations and gym classes from Redux store
  const registrations = useSelector(state => Object.values(state.classRegistration.entries));
  const gymClasses = useSelector(state => state.gymClasses.entries);
  const isLoadingRegs = useSelector(state => state.classRegistration.isLoading);
  const isLoadingClasses = useSelector(state => state.gymClasses.isLoading);

  if (isLoadingRegs || isLoadingClasses) {
    return <div>Loading your registered classes...</div>;
  }

  if (registrations.length === 0) {
    return <div>You have not registered for any classes yet.</div>;
  }

const uniqueGymClassIds = [...new Set(registrations.map(reg => reg.gymClassId))];

const registeredClasses = uniqueGymClassIds
  .map(id => gymClasses[id])
  .filter(gymClass => gymClass);

  return (
    <div>
      <h2>Your Registered Classes</h2>
      <ul>
        {registeredClasses.map(gymClass => (
          <li key={gymClass.id} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '0.5rem' }}>
            <h3>{gymClass.name}</h3>
            <p><strong>Instructor:</strong> {gymClass.instructorName || 'N/A'}</p>
            <p><strong>Location:</strong> {gymClass.location || 'N/A'}</p>
            <p><strong>Time:</strong> {gymClass.startTime ? new Date(gymClass.startTime).toLocaleString() : 'TBD'}</p>
            <p><strong>Description:</strong> {gymClass.description || 'No description available.'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GymClassRegistered;

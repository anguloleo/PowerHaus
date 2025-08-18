import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClassRegistrations } from '../../store/classRegistration';

const GymClassRegistered = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchClassRegistrations());
  }, [dispatch]);

  const registrations = useSelector(state => Object.values(state.classRegistration.entries));
  const isLoading = useSelector(state => state.classRegistration.isLoading);

  if (isLoading) {
    return <div>Loading your registered classes...</div>;
  }

  if (registrations.length === 0) {
    return <div>You have not registered for any classes yet.</div>;
  }

  return (
    <div>
      <h2>Your Registered Classes</h2>
      <ul>
        {registrations.map(reg => {
          const gymClass = reg.GymClass; 
          return (
            <li
              key={reg.id}
              style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '0.5rem' }}
            >
              <h3>{gymClass?.name}</h3>
              <p>
                <strong>Instructor:</strong>{' '}
                {gymClass?.instructor
                  ? `${gymClass.instructor.firstName} ${gymClass.instructor.lastName}`
                  : 'N/A'}
              </p>
              <p><strong>Location:</strong> {gymClass?.location || 'N/A'}</p>
              <p>
                <strong>Time:</strong>{' '}
                {gymClass?.date && gymClass?.time
                  ? new Date(`${gymClass.date}T${gymClass.time}`).toLocaleString()
                  : 'TBD'}
              </p>
              <p><strong>Description:</strong> {gymClass?.description || 'No description available.'}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default GymClassRegistered;

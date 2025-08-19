import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClassRegistrations, removeClassRegistration } from '../../store/classRegistration';

const GymClassRegistered = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState(null); // new error state

  useEffect(() => {
    dispatch(fetchClassRegistrations());
  }, [dispatch]);

  const registrations = useSelector(state => Object.values(state.classRegistration.entries));
  const isLoading = useSelector(state => state.classRegistration.isLoading);

  const handleUnregister = async (registrationId, className) => {
    const confirmed = window.confirm(`Are you sure you want to unregister from "${className}"?`);
    if (!confirmed) return;

    try {
      const result = await dispatch(removeClassRegistration(registrationId));
      if (!result.success) {
        setError(result.message);
      } else {
        setError(null); 
      }
    } catch (error) {
      console.error("Failed to unregister:", error);
      setError('Something went wrong while unregistering.');
    }
  };

  if (isLoading) {
    return <div>Loading your registered classes...</div>;
  }

  if (registrations.length === 0) {
    return <div>You have not registered for any classes yet.</div>;
  }

  return (
    <div>
      <h2>Your Registered Classes</h2>

      {/* Show any error messages */}
      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

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
              <p><strong>Gym:</strong> {gymClass?.gym?.name || 'N/A'}</p>
              <p><strong>Location:</strong> {gymClass?.location || 'N/A'}</p>
              <p>
                <strong>Time:</strong>{' '}
                {gymClass?.date && gymClass?.time
                  ? new Date(`${gymClass.date}T${gymClass.time}`).toLocaleString()
                  : 'TBD'}
              </p>
              <p><strong>Description:</strong> {gymClass?.description || 'No description available.'}</p>
              
              {/* Unregister Button with Confirmation */}
              <button
                onClick={() => handleUnregister(reg.id, gymClass?.name)}
                style={{ marginTop: '0.5rem', padding: '0.25rem 0.5rem', cursor: 'pointer' }}
              >
                Unregister
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default GymClassRegistered;

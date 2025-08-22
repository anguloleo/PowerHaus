import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClassRegistrations, removeClassRegistration } from '../../store/classRegistration';
import { useModal } from '../../context/Modal';
import ConfirmActionModal from '../ConfirmActionModal';
import './GymClassRegistered.css';

const GymClassRegistered = () => {
  const dispatch = useDispatch();
  const { setModalContent } = useModal();
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(fetchClassRegistrations());
  }, [dispatch]);

  const registrations = useSelector(state => 
    Object.values(state.classRegistration.entries)
      .sort((a, b) => {
        const dateA = new Date(`${a.GymClass?.date}T${a.GymClass?.time}`);
        const dateB = new Date(`${b.GymClass?.date}T${b.GymClass?.time}`);
        return dateA - dateB;
      })
  );

  const isLoading = useSelector(state => state.classRegistration.isLoading);

  const handleUnregister = (registrationId, className) => {
    // Open ConfirmActionModal instead of window.confirm
    setModalContent(
      <ConfirmActionModal
        message={`Are you sure you want to unregister from "${className}"?`}
        onConfirm={async () => {
          try {
            const result = await dispatch(removeClassRegistration(registrationId));
            if (!result.success) {
              setError(result.message);
            } else {
              setError(null);
            }
          } catch (err) {
            console.error("Failed to unregister:", err);
            setError('Something went wrong while unregistering.');
          }
        }}
      />
    );
  };

  if (isLoading) return <div className="loading">Loading your registered classes...</div>;
  if (registrations.length === 0) return <div className="empty">You have not registered for any classes yet.</div>;

  return (
    <div className="registered-classes-container">
      <h2>Your Registered Classes</h2>

      {error && <div className="error-message">{error}</div>}

      <ul className="registered-classes-list">
        {registrations.map(reg => {
          const gymClass = reg.GymClass;

          const formattedTime = gymClass?.date && gymClass?.time
            ? new Date(`${gymClass.date}T${gymClass.time}`).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })
            : 'TBD';

          return (
            <li key={reg.id} className="registered-class-card">
              <div className="class-header">
                <h3>{gymClass?.name}</h3>
                <button
                  className="unregister-btn"
                  onClick={() => handleUnregister(reg.id, gymClass?.name)}
                >
                  Unregister
                </button>
              </div>
              <div className="class-info">
                <p><strong>Instructor:</strong> {gymClass?.instructor ? `${gymClass.instructor.firstName} ${gymClass.instructor.lastName}` : 'N/A'}</p>
                <p><strong>Gym:</strong> {gymClass?.gym?.name || 'N/A'}</p>
                <p><strong>Location:</strong> {gymClass?.location || 'N/A'}</p>
                <p><strong>Time:</strong> {formattedTime}</p>
                <p><strong>Description:</strong> {gymClass?.description || 'No description available.'}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default GymClassRegistered;

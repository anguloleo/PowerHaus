import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRepairRequests, removeRepairRequest } from '../../store/repairRequests';

export default function RepairRequestList() {
  const dispatch = useDispatch();

  const repairRequests = useSelector(state => Object.values(state.repairRequests));
  const currentUser = useSelector(state => state.session.user);

  useEffect(() => {
    dispatch(fetchRepairRequests());
  }, [dispatch]);

  // Sort from newest to oldest
  const sortedRequests = [...repairRequests].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this repair request?')) {
      dispatch(removeRepairRequest(id));
    }
  };

  // Placeholder for Add New Repair Request action
  const handleAddNew = () => {
    // Example: navigate to /repair-requests/new or open a modal
    console.log('Add new repair request clicked');
  };

  // Placeholder for Modify action
  const handleModify = (id) => {
    // Example: navigate to /repair-requests/:id/edit or open a modal
    console.log(`Modify repair request ${id} clicked`);
  };

  if (!sortedRequests.length) {
    return (
      <div>
        <button onClick={handleAddNew}>Add New Repair Request</button>
        <p>No repair requests found.</p>
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleAddNew} style={{ marginBottom: '1rem' }}>
        Add New Repair Request
      </button>

      <h2>
        {currentUser?.role === 'admin' || currentUser?.role === 'staff'
          ? 'All Repair Requests'
          : 'Your Repair Requests'}
      </h2>
      <ul>
        {sortedRequests.map((request) => {
          const createdAt = new Date(request.createdAt);
          const updatedAt = new Date(request.updatedAt);
          const showUpdated = updatedAt > createdAt;

          return (
            <li
              key={request.id}
              style={{
                marginBottom: '1rem',
                border: '1px solid #ccc',
                padding: '0.5rem'
              }}
            >
              <p>
                <strong>Equipment:</strong> {request.equipment?.name || 'Unknown'} (Machine #{request.equipment?.id || 'N/A'})
              </p>

              {request.imageUrl && (
                <img
                  src={request.imageUrl}
                  alt={`Equipment ${request.equipment?.name || ''}`}
                  style={{ maxWidth: '200px', maxHeight: '150px', display: 'block', marginBottom: '0.5rem' }}
                />
              )}

              <p><strong>Description:</strong> {request.description || 'No description provided'}</p>
              <p><strong>Status:</strong> {request.status || 'Pending'}</p>
              <p><small>Submitted: {createdAt.toLocaleString()}</small></p>
              {showUpdated && (
                <p><small>Updated: {updatedAt.toLocaleString()}</small></p>
              )}

              <button onClick={() => handleModify(request.id)} style={{ marginRight: '0.5rem' }}>
                Modify
              </button>
              <button onClick={() => handleDelete(request.id)}>Delete</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

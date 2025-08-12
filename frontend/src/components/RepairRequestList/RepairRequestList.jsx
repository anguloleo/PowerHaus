import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRepairRequests, removeRepairRequest } from '../../store/repairRequests';
import RepairRequestFormModal from '../RepairRequestFormModal';
import RepairRequestModifyModal from '../RepairRequestModifyModal';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import ConfirmDeleteModal from '../ConfirmDeleteModal';




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

  if (!sortedRequests.length) {
    return (
      <div>
        <OpenModalButton
          buttonText="Add New Repair Request"
          modalComponent={<RepairRequestFormModal />}
        />
        <p>No repair requests found.</p>
      </div>
    );
  }

  return (
    <div>
      <OpenModalButton
        buttonText="Add New Repair Request"
        modalComponent={<RepairRequestFormModal />}
      />

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
                <strong>Gym:</strong> {request.equipment?.gym?.name || 'Unknown'} 
              </p>
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

              <OpenModalButton
                buttonText="Modify"
                modalComponent={<RepairRequestModifyModal request={request} />}
              />
             
              <OpenModalButton
                buttonText="Delete"
                modalComponent={
                  <ConfirmDeleteModal
                    message="Are you sure you want to delete this repair request?"
                    onConfirm={() => dispatch(removeRepairRequest(request.id))}
                  />
                }
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

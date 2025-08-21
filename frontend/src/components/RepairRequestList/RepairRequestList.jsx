import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRepairRequests, removeRepairRequest } from '../../store/repairRequests';
import RepairRequestFormModal from '../RepairRequestFormModal';
import RepairRequestModifyModal from '../RepairRequestModifyModal';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import ConfirmDeleteModal from '../ConfirmDeleteModal';
import './RepairRequestList.css';

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

  return (
    <div className="repair-request-list-container">
      <OpenModalButton
        buttonText="Add New Repair Request"
        modalComponent={<RepairRequestFormModal />}
        className="add-repair-btn"
      />

      <h2>
        {currentUser?.role === 'admin' || currentUser?.role === 'staff'
          ? 'All Repair Requests'
          : 'Your Repair Requests'}
      </h2>

      {sortedRequests.length === 0 ? (
        <p className="no-requests">No repair requests found.</p>
      ) : (
        <ul className="repair-request-list">
          {sortedRequests.map((request) => {
            const createdAt = new Date(request.createdAt);
            const updatedAt = new Date(request.updatedAt);
            const showUpdated = updatedAt > createdAt;

            return (
              <li key={request.id} className="repair-request-card">
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
                    className="repair-request-image"
                  />
                )}

                <p><strong>Description:</strong> {request.description || 'No description provided'}</p>
                <p><strong>Status:</strong> {request.status || 'Pending'}</p>
                <p className="timestamps"><small>Submitted: {createdAt.toLocaleString()}</small></p>
                {showUpdated && (
                  <p className="timestamps"><small>Updated: {updatedAt.toLocaleString()}</small></p>
                )}

                <div className="repair-request-buttons">
                  <OpenModalButton
                    buttonText="Modify"
                    modalComponent={<RepairRequestModifyModal request={request} />}
                    className="modify-btn"
                  />

                  <OpenModalButton
                    buttonText="Delete"
                    modalComponent={
                      <ConfirmDeleteModal
                        message="Are you sure you want to delete this repair request?"
                        onConfirm={() => dispatch(removeRepairRequest(request.id))}
                      />
                    }
                    className="delete-btn"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

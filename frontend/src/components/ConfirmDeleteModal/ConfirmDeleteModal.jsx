
import { useModal } from '../../context/Modal';
import './ConfirmDeleteModal.css'; 

export default function ConfirmDeleteModal({ message, onConfirm, onCancel }) {
  const { closeModal } = useModal();

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    closeModal();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    closeModal();
  };

  return (
    <div className="confirm-delete-modal">
      <h2>Confirm Delete</h2>
      <p>{message || 'Are you sure you want to delete this?'}</p>
      <div className="buttons">
        <button onClick={handleConfirm} className="confirm-btn" style={{ marginRight: '0.5rem' }}>
          Yes, Delete
        </button>
        <button onClick={handleCancel} className="cancel-btn">
          Cancel
        </button>
      </div>
    </div>
  );
}

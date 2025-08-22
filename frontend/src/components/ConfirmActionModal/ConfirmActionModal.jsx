import { useModal } from '../../context/Modal';
import './ConfirmActionModal.css';

export default function ConfirmActionModal({
  actionName = "Confirm",
  message,
  confirmText,
  cancelText = "Cancel",
  actionColor = "#d9534f",
  onConfirm,
  onCancel
}) {
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
    <div className="modal-container action-modal">
      <div className="modal-header">
        <h2 style={{ color: actionColor }}>{actionName}</h2>
        <button className="close-button" onClick={handleCancel}>&times;</button>
      </div>

      <p className="confirm-message">
        {message || `Are you sure you want to ${actionName.toLowerCase()}?`}
      </p>

      <div className="buttons">
        <button
          onClick={handleConfirm}
          className="confirm-btn"
          style={{ backgroundColor: actionColor }}
        >
          {confirmText || actionName}
        </button>
        <button onClick={handleCancel} className="cancel-btn">{cancelText}</button>
      </div>
    </div>
  );
}

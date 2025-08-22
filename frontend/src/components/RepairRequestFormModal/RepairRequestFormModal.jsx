import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createRepairRequest, fetchRepairRequests } from '../../store/repairRequests';
import { fetchGyms } from '../../store/gyms';
import { fetchEquipmentByGymId, clearEquipmentByGym } from '../../store/equipment';
import { useModal } from '../../context/Modal';
import './RepairRequestFormModal.css';

const RepairRequestFormModal = () => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const currentUser = useSelector(state => state.session.user);
  const gyms = Object.values(useSelector(state => state.gyms.all));
  const equipmentByGym = useSelector(state => state.equipment.byGymId);
  const [selectedGymId, setSelectedGymId] = useState('');
  const equipment = selectedGymId ? equipmentByGym[selectedGymId] || [] : [];
  const [equipmentId, setEquipmentId] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState([]);

  useEffect(() => { dispatch(fetchGyms()); }, [dispatch]);

  useEffect(() => {
    if (selectedGymId) {
      dispatch(fetchEquipmentByGymId(selectedGymId));
      setEquipmentId('');
    } else {
      dispatch(clearEquipmentByGym(selectedGymId));
    }
  }, [dispatch, selectedGymId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    const repairData = {
      equipmentId,
      description,
      imageUrl: imageUrl || null,
      status: 'Open',
      userId: currentUser?.id
    };

    try {
      await dispatch(createRepairRequest(repairData));
      await dispatch(fetchRepairRequests());
      closeModal();  
    } catch (res) {
      const data = await res.json();
      if (data?.errors) setErrors(data.errors);
    }
  };

  return (
    <div className="modal-container repair-modal">
      <div className="modal-header">
        <h2>Report Broken Equipment</h2>
        <button className="close-button" onClick={closeModal}>&times;</button>
      </div>

      {errors.length > 0 && (
        <ul className="form-errors">
          {errors.map((err, i) => <li key={i}>{err}</li>)}
        </ul>
      )}

      <form className="repair-request-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Gym:</label>
          <select
            value={selectedGymId}
            onChange={(e) => setSelectedGymId(e.target.value)}
            required
          >
            <option value="" disabled>Select a gym</option>
            {gyms.map(gym => <option key={gym.id} value={gym.id}>{gym.name}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Select Equipment:</label>
          <select
            value={equipmentId}
            onChange={(e) => setEquipmentId(e.target.value)}
            required
            disabled={!selectedGymId || equipment.length === 0}
          >
            <option value="" disabled>
              {selectedGymId ? "Select equipment" : "Select a gym first"}
            </option>
            {equipment.map(eq => <option key={eq.id} value={eq.id}>{eq.name}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Description of the Problem:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label>Optional Image URL:</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <button type="submit" disabled={!equipmentId}>Submit Repair Request</button>
      </form>
    </div>
  );
};

export default RepairRequestFormModal;

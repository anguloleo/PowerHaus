import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createRepairRequest } from '../../store/repairRequests';
import { fetchGyms } from '../../store/gyms';
import { fetchEquipmentByGymId, clearEquipmentByGym } from '../../store/equipment';
import './RepairRequestForm.css';

const RepairRequestForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.session.user);
  const gyms = Object.values(useSelector(state => state.gyms.all)); 
  const equipmentByGym = useSelector(state => state.equipment.byGymId);
  const [selectedGymId, setSelectedGymId] = useState('');
  const equipment = selectedGymId ? equipmentByGym[selectedGymId] || [] : [];
  const [equipmentId, setEquipmentId] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState([]);

  // Load all gyms when component mounts
  useEffect(() => {
    dispatch(fetchGyms());
  }, [dispatch]);

  // Fetch equipment when gym changes
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
      status: 'open',
      userId: currentUser?.id
    };

    try {
      await dispatch(createRepairRequest(repairData));
      if (onSuccess) onSuccess(); // optional callback
      setSelectedGymId('');
      setEquipmentId('');
      setDescription('');
      setImageUrl('');
    } catch (res) {
      const data = await res.json();
      if (data?.errors) setErrors(data.errors);
    }
  };

  return (
    <form className="repair-request-form" onSubmit={handleSubmit}>
      <h2>Report Broken Equipment</h2>

      {errors.length > 0 && (
        <ul className="form-errors">
          {errors.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      )}

      {/* GYM DROPDOWN */}
      <label>
        Select Gym:
        <select
          value={selectedGymId}
          onChange={(e) => setSelectedGymId(e.target.value)}
          required
        >
          <option value="" disabled>Select a gym</option>
          {gyms && gyms.map(gym => (
            <option key={gym.id} value={gym.id}>{gym.name}</option>
          ))}
        </select>
      </label>

      {/* EQUIPMENT DROPDOWN */}
      <label>
        Select Equipment:
        <select
          value={equipmentId}
          onChange={(e) => setEquipmentId(e.target.value)}
          required
          disabled={!selectedGymId || equipment.length === 0}
        >
          <option value="" disabled>
            {selectedGymId ? "Select equipment" : "Select a gym first"}
          </option>
          {equipment && equipment.map(eq => (
            <option key={eq.id} value={eq.id}>
              {eq.name} (ID: {eq.id})
            </option>
          ))}
        </select>
      </label>

      {/* DESCRIPTION TEXTAREA */}
      <label>
        Description of the Problem:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          required
        />
      </label>

      {/* OPTIONAL IMAGE URL */}
      <label>
        Optional Image URL:
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </label>

      <button type="submit" disabled={!equipmentId}>Submit Repair Request</button>
    </form>
  );
};

export default RepairRequestForm;

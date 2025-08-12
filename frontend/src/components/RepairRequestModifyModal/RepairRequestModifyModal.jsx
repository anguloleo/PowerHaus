import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editRepairRequest, fetchRepairRequests } from '../../store/repairRequests';
import { fetchGyms } from '../../store/gyms';
import { fetchEquipmentByGymId, clearEquipmentByGym } from '../../store/equipment';
import { useModal } from '../../context/Modal';
import './RepairRequestModifyModal.css';

const RepairRequestModifyModal = ({ request }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const currentUser = useSelector(state => state.session.user);
  const gyms = Object.values(useSelector(state => state.gyms.all || {}));
  const equipmentByGym = useSelector(state => state.equipment.byGymId || {});

  // Helpers to robustly pick the IDs from varying shapes:
  const getRequestGymIdStr = () => {
    // Try several possible locations for the gym id
    const id =
      request?.equipment?.gymId ??
      request?.equipment?.gym?.id ??
      request?.gymId ??
      null;
    return id != null ? String(id) : '';
  };
  const getRequestEquipmentIdStr = () => {
    const id = request?.equipmentId ?? request?.equipment?.id ?? null;
    return id != null ? String(id) : '';
  };

  const [selectedGymId, setSelectedGymId] = useState(getRequestGymIdStr());
  const [equipmentId, setEquipmentId] = useState(getRequestEquipmentIdStr());
  const [description, setDescription] = useState(request?.description || '');
  const [imageUrl, setImageUrl] = useState(request?.imageUrl || '');
  const [errors, setErrors] = useState([]);

  // Safely get equipment list for selected gym (try string and numeric keys)
  const equipmentForSelectedGym = (() => {
    if (!selectedGymId) return [];
    return (
      equipmentByGym[selectedGymId] ??
      equipmentByGym[Number(selectedGymId)] ??
      []
    );
  })();

  // Load gyms on mount
  useEffect(() => {
    dispatch(fetchGyms());
  }, [dispatch]);

  // When request changes: reset fields based on request and fetch its gym equipment
  useEffect(() => {
    setDescription(request?.description || '');
    setImageUrl(request?.imageUrl || '');
    setErrors([]);

    const reqGymId = getRequestGymIdStr();
    const reqEquipmentId = getRequestEquipmentIdStr();

    if (reqGymId) {
      setSelectedGymId(reqGymId);
      // fetchEquipmentByGymId probably expects a number id; give Number(...) 
      dispatch(fetchEquipmentByGymId(Number(reqGymId)));
    } else {
      setSelectedGymId('');
    }

    setEquipmentId(reqEquipmentId || '');
  }, [request?.id, dispatch]); // depend on request.id to catch opening another modal

  // If gyms finish loading and nothing selected yet, default to request's gym or first gym
  useEffect(() => {
    if (gyms.length > 0 && !selectedGymId) {
      const reqGymId = getRequestGymIdStr();
      if (reqGymId) {
        setSelectedGymId(reqGymId);
      } else {
        setSelectedGymId(String(gyms[0].id));
      }
    }
  }, [gyms, selectedGymId, request]);

  // When selectedGymId changes (user changed or we set from request), fetch equipment for it
  useEffect(() => {
    if (selectedGymId) {
      dispatch(fetchEquipmentByGymId(Number(selectedGymId)));
    } else {
      dispatch(clearEquipmentByGym(selectedGymId));
    }
  }, [dispatch, selectedGymId]);

  
  // After equipment list for a gym loads, ensure the equipmentId matches the request or pick first valid
  useEffect(() => {
    const list = equipmentForSelectedGym;
    if (list.length > 0) {
      // Try to keep the request's equipment if present, otherwise choose first
      const reqEquipmentId = getRequestEquipmentIdStr();
      const foundReq = reqEquipmentId && list.some(eq => String(eq.id) === reqEquipmentId);

      if (foundReq) {
        setEquipmentId(reqEquipmentId);
      } else {
        // If current equipmentId is not in loaded list, default to first
        if (!list.some(eq => String(eq.id) === equipmentId)) {
          setEquipmentId(String(list[0].id));
        }
      }
    } else {
      // No equipment for selected gym
      setEquipmentId('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [equipmentByGym, selectedGymId, request?.id]); // include request.id so opening a new request re-runs this

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    // Convert equipmentId to number for backend if needed
    const repairData = {
      equipmentId: equipmentId ? Number(equipmentId) : null,
      description,
      imageUrl: imageUrl || null,
      status: request?.status,
      userId: currentUser?.id
    };

    try {
      await dispatch(editRepairRequest(request.id, repairData));
      await dispatch(fetchRepairRequests());
      closeModal();
    } catch (res) {
      const data = await res.json();
      if (data?.errors) setErrors(data.errors);
    }
  };

  return (
    <>
      <h2>Edit Repair Request</h2>

      {errors.length > 0 && (
        <ul className="form-errors">
          {errors.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      )}

      <form className="repair-request-form" onSubmit={handleSubmit}>
        {/* GYM DROPDOWN */}
        <label>
          Select Gym:
          <select
            value={selectedGymId}
            onChange={(e) => setSelectedGymId(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a gym
            </option>
            {gyms.map((gym) => (
              <option key={gym.id} value={String(gym.id)}>
                {gym.name}
              </option>
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
            disabled={!selectedGymId || equipmentForSelectedGym.length === 0}
          >
            <option value="" disabled>
              {selectedGymId ? 'Select equipment' : 'Select a gym first'}
            </option>
            {equipmentForSelectedGym.map((eq) => (
              <option key={eq.id} value={String(eq.id)}>
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

        <button type="submit" disabled={!equipmentId}>
          Save Changes
        </button>
      </form>
    </>
  );
};

export default RepairRequestModifyModal;

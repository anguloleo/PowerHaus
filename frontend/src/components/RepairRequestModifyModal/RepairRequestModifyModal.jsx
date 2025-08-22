import { useState, useEffect, useCallback } from 'react';
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

  // --- Memoized helpers ---
  const getRequestGymIdStr = useCallback(() => {
    const id =
      request?.equipment?.gymId ??
      request?.equipment?.gym?.id ??
      request?.gymId ??
      null;
    return id != null ? String(id) : '';
  }, [request]);

  const getRequestEquipmentIdStr = useCallback(() => {
    const id = request?.equipmentId ?? request?.equipment?.id ?? null;
    return id != null ? String(id) : '';
  }, [request]);

  // --- Local state ---
  const [selectedGymId, setSelectedGymId] = useState(getRequestGymIdStr());
  const [equipmentId, setEquipmentId] = useState(getRequestEquipmentIdStr());
  const [description, setDescription] = useState(request?.description || '');
  const [imageUrl, setImageUrl] = useState(request?.imageUrl || '');
  const [errors, setErrors] = useState([]);

  // --- Derived equipment list for selected gym ---
  const equipmentForSelectedGym = (() => {
    if (!selectedGymId) return [];
    return (
      equipmentByGym[selectedGymId] ??
      equipmentByGym[Number(selectedGymId)] ??
      []
    );
  })();

  // --- Load gyms on mount ---
  useEffect(() => {
    dispatch(fetchGyms());
  }, [dispatch]);

  // --- Reset fields when request changes ---
  useEffect(() => {
    setDescription(request?.description || '');
    setImageUrl(request?.imageUrl || '');
    setErrors([]);

    const reqGymId = getRequestGymIdStr();
    const reqEquipmentId = getRequestEquipmentIdStr();

    if (reqGymId) {
      setSelectedGymId(reqGymId);
      dispatch(fetchEquipmentByGymId(Number(reqGymId)));
    } else {
      setSelectedGymId('');
    }

    setEquipmentId(reqEquipmentId || '');
  }, [
    request?.id,
    request?.description,
    request?.imageUrl,
    getRequestGymIdStr,
    getRequestEquipmentIdStr,
    dispatch
  ]);

  // --- Set selected gym after gyms load if not yet selected ---
  useEffect(() => {
    if (gyms.length > 0 && !selectedGymId) {
      const reqGymId = getRequestGymIdStr();
      if (reqGymId) {
        setSelectedGymId(reqGymId);
      } else {
        setSelectedGymId(String(gyms[0].id));
      }
    }
  }, [gyms, selectedGymId, getRequestGymIdStr]);

  // --- Fetch equipment when selectedGymId changes ---
  useEffect(() => {
    if (selectedGymId) {
      dispatch(fetchEquipmentByGymId(Number(selectedGymId)));
    } else {
      dispatch(clearEquipmentByGym(selectedGymId));
    }
  }, [dispatch, selectedGymId]);

  // --- Ensure equipmentId is valid after equipment list loads ---
  useEffect(() => {
    const list = equipmentForSelectedGym;
    if (list.length > 0) {
      const reqEquipmentId = getRequestEquipmentIdStr();
      const foundReq = reqEquipmentId && list.some(eq => String(eq.id) === reqEquipmentId);

      if (foundReq) {
        setEquipmentId(reqEquipmentId);
      } else if (!list.some(eq => String(eq.id) === equipmentId)) {
        setEquipmentId(String(list[0].id));
      }
    } else {
      setEquipmentId('');
    }
  }, [equipmentForSelectedGym, equipmentId, getRequestEquipmentIdStr]);

  // --- Form submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

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

        {/* DESCRIPTION */}
        <label>
          Description of the Problem:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            required
          />
        </label>

        {/* IMAGE URL */}
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
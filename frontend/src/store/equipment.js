import { csrfFetch } from './csrf';

// Action Types
const SET_EQUIPMENT_BY_GYM = 'equipment/SET_EQUIPMENT_BY_GYM';
const CLEAR_EQUIPMENT_BY_GYM = 'equipment/CLEAR_EQUIPMENT_BY_GYM';

// Action Creators
const setEquipmentByGym = (gymId, equipmentList) => ({
  type: SET_EQUIPMENT_BY_GYM,
  gymId,
  equipmentList,
});

export const clearEquipmentByGym = (gymId) => ({
  type: CLEAR_EQUIPMENT_BY_GYM,
  gymId,
});

// Thunks
export const fetchEquipmentByGymId = (gymId) => async (dispatch) => {
  const res = await csrfFetch(`/api/gyms/${gymId}/equipment`);
  if (res.ok) {
    const equipmentList = await res.json();
    dispatch(setEquipmentByGym(gymId, equipmentList));
    return equipmentList;
  } else {
    const error = await res.json();
    throw error;
  }
};

// Reducer
const initialState = {
  byGymId: {},
};

const equipmentReducer = (state = initialState, action) => {
  switch (action.type) {
    
    case SET_EQUIPMENT_BY_GYM: {
      return {
        ...state,
        byGymId: {
          ...state.byGymId,
          [action.gymId]: action.equipmentList,
        },
      };
    }
    case CLEAR_EQUIPMENT_BY_GYM: {
      // Remove the equipment list for a specific gym
      const newByGymId = { ...state.byGymId };
      delete newByGymId[action.gymId];
      return {
        ...state,
        byGymId: newByGymId,
      };
    }
    default:
      return state;
  }
};

export default equipmentReducer;

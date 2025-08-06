import { csrfFetch } from './csrf';

// Action Types
const SET_ALL_GYMS = 'gyms/SET_ALL_GYMS';
const SET_ONE_GYM = 'gyms/SET_ONE_GYM';
const ADD_GYM = 'gyms/ADD_GYM';
const UPDATE_GYM = 'gyms/UPDATE_GYM';
const DELETE_GYM = 'gyms/DELETE_GYM';

// Action Creators
const setAllGyms = (gyms) => ({
  type: SET_ALL_GYMS,
  gyms,
});

const setOneGym = (gym) => ({
  type: SET_ONE_GYM,
  gym,
});

const addGym = (gym) => ({
  type: ADD_GYM,
  gym,
});

const updateGym = (gym) => ({
  type: UPDATE_GYM,
  gym,
});

const removeGym = (gymId) => ({
  type: DELETE_GYM,
  gymId,
});

// Thunks

// Get all gyms
export const fetchGyms = () => async (dispatch) => {
  const res = await csrfFetch('/api/gyms');
  if (res.ok) {
    const data = await res.json();
    dispatch(setAllGyms(data.gyms));
  }
};

// Get one gym by ID
export const fetchGymById = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/gyms/${id}`);
  if (res.ok) {
    const gym = await res.json();
    dispatch(setOneGym(gym));
  }
};

// Create new gym
export const createGym = (gymData) => async (dispatch) => {
  const res = await csrfFetch('/api/gyms', {
    method: 'POST',
    body: JSON.stringify(gymData),
  });
  if (res.ok) {
    const newGym = await res.json();
    dispatch(addGym(newGym));
    return newGym;
  }
};

// Update a gym
export const editGym = (id, gymData) => async (dispatch) => {
  const res = await csrfFetch(`/api/gyms/${id}`, {
    method: 'PUT',
    body: JSON.stringify(gymData),
  });
  if (res.ok) {
    const updatedGym = await res.json();
    dispatch(updateGym(updatedGym));
    return updatedGym;
  }
};

// Delete a gym
export const deleteGym = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/gyms/${id}`, {
    method: 'DELETE',
  });
  if (res.ok) {
    dispatch(removeGym(id));
  }
};

// Initial State
const initialState = {
  all: {},        // All gyms by ID
  current: null,  // Selected gym (for details)
};

// Reducer
export default function gymReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ALL_GYMS: {
      const allGyms = {};
      action.gyms.forEach(gym => {
        allGyms[gym.id] = gym;
      });
      return {
        ...state,
        all: allGyms,
      };
    }

    case SET_ONE_GYM:
      return {
        ...state,
        current: action.gym,
      };

    case ADD_GYM:
      return {
        ...state,
        all: {
          ...state.all,
          [action.gym.id]: action.gym,
        },
        current: action.gym,
      };

    case UPDATE_GYM:
      return {
        ...state,
        all: {
          ...state.all,
          [action.gym.id]: action.gym,
        },
        current: action.gym,
      };

    case DELETE_GYM: {
      const newState = { ...state, all: { ...state.all } };
      delete newState.all[action.gymId];

      // Clear current if it was the one deleted
      if (state.current && state.current.id === action.gymId) {
        newState.current = null;
      }

      return newState;
    }

    default:
      return state;
  }
}

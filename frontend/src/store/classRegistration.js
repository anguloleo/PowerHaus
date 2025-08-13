import { csrfFetch } from './csrf';

// Action Types
const LOAD_REGISTRATIONS = 'classRegistration/load';
const ADD_REGISTRATION = 'classRegistration/add';
const DELETE_REGISTRATION = 'classRegistration/delete';

// Action Creators
export const loadRegistrations = (registrations) => ({
  type: LOAD_REGISTRATIONS,
  registrations
});

export const addRegistration = (registration) => ({
  type: ADD_REGISTRATION,
  registration
});

export const deleteRegistration = (registrationId) => ({
  type: DELETE_REGISTRATION,
  registrationId
});

// Thunks

// Fetch all registrations from current user
export const fetchClassRegistrations = () => async (dispatch) => {
  const res = await fetch('/api/class-registrations');

  if (res.ok) {
    const data = await res.json();

    console.log("API registrations data:", data);
    const registrationArray = data.Registrations || [];

   dispatch(loadRegistrations(registrationArray));
  }
};

// Create a new registration (user enrolling in a class)
export const createClassRegistration = ({ userId, gymClassId }) => async (dispatch) => {
  const res = await csrfFetch('/api/class-registrations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, gymClassId })
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(addRegistration(data));
    return data;
  } else {
    const error = await res.json();
    throw error;
  }
};

// Delete a registration (user unenrolls from a class)
export const removeClassRegistration = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/class-registrations/${id}`, {
    method: 'DELETE'
  });

  if (res.ok) {
    dispatch(deleteRegistration(id));
  }
};

// Initial state
const initialState = {
  entries: {}, // normalized: { [id]: { id, userId, gymClassId, ... } }
  isLoading: true
};

// Reducer
const classRegistrationReducer = (state = initialState, action) => {
  switch (action.type) {
    
    case LOAD_REGISTRATIONS: {
      console.log("LOAD_REGISTRATIONS payload:", action.registrations);
      const normalized = {};
      action.registrations.forEach((reg) => {
        normalized[reg.id] = reg;
      });
      return { ...state, entries: normalized, isLoading: false };
    }

    case ADD_REGISTRATION: {
      return {
        ...state,
        entries: {
          ...state.entries,
          [action.registration.id]: action.registration
        }
      };
    }

    case DELETE_REGISTRATION: {
      const newEntries = { ...state.entries };
      delete newEntries[action.registrationId];
      return {
        ...state,
        entries: newEntries
      };
    }

    default:
      return state;
  }
};

export default classRegistrationReducer;

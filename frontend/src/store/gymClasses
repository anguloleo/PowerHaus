import { csrfFetch } from './csrf';

// Action Types
const LOAD_GYM_CLASSES = 'gymClass/loadGymClasses';
const LOAD_GYM_CLASS = 'gymClass/loadGymClass';
const ADD_GYM_CLASS = 'gymClass/addGymClass';
const DELETE_GYM_CLASS = 'gymClass/deleteGymClass';

// Action Creators
export const loadGymClasses = (classes) => ({
  type: LOAD_GYM_CLASSES,
  classes
});

export const loadGymClass = (gymClass) => ({
  type: LOAD_GYM_CLASS,
  gymClass
});

export const addGymClass = (gymClass) => ({
  type: ADD_GYM_CLASS,
  gymClass
});

export const deleteGymClass = (gymClassId) => ({
  type: DELETE_GYM_CLASS,
  gymClassId
});

// Thunks
export const fetchGymClasses = () => async (dispatch) => {
  const res = await fetch('/api/classes');

  if (res.ok) {
    const data = await res.json();
    dispatch(loadGymClasses(data.GymClasses || data));
  }
};

export const fetchGymClass = (id) => async (dispatch) => {
  const res = await fetch(`/api/classes/${id}`);

  if (res.ok) {
    const data = await res.json();
    dispatch(loadGymClass(data));
  }
};

export const createGymClass = (newClass) => async (dispatch) => {
  const res = await csrfFetch('/api/classes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newClass)
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(addGymClass(data));
    return data;
  } else {
    const error = await res.json();
    throw error;
  }
};

export const removeGymClass = (id) => async (dispatch) => {
  const res = await csrfFetch(`/api/classes/${id}`, {
    method: 'DELETE'
  });

  if (res.ok) {
    dispatch(deleteGymClass(id));
  }
};

// Reducer
const initialState = { entries: {}, isLoading: true };

const gymClassReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_GYM_CLASSES: {
      const normalized = {};
      action.classes.forEach(gymClass => {
        normalized[gymClass.id] = gymClass;
      });
      return { ...state, entries: normalized, isLoading: false };
    }

    case LOAD_GYM_CLASS: {
      return {
        ...state,
        entries: {
          ...state.entries,
          [action.gymClass.id]: action.gymClass
        },
        isLoading: false
      };
    }

    case ADD_GYM_CLASS: {
      return {
        ...state,
        entries: {
          ...state.entries,
          [action.gymClass.id]: action.gymClass
        }
      };
    }

    case DELETE_GYM_CLASS: {
      const newEntries = { ...state.entries };
      delete newEntries[action.gymClassId];
      return { ...state, entries: newEntries };
    }

    default:
      return state;
  }
};

export default gymClassReducer;

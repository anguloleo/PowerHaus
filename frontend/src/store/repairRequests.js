import { csrfFetch } from './csrf';

// Action Types
const SET_REPAIR_REQUESTS = 'repairRequests/SET_REPAIR_REQUESTS';
const ADD_REPAIR_REQUEST = 'repairRequests/ADD_REPAIR_REQUEST';
const UPDATE_REPAIR_REQUEST = 'repairRequests/UPDATE_REPAIR_REQUEST';
const DELETE_REPAIR_REQUEST = 'repairRequests/DELETE_REPAIR_REQUEST';



// Action Creators
const setRepairRequests = (repairRequests) => ({
  type: SET_REPAIR_REQUESTS,
  repairRequests
});

const addRepairRequest = (repairRequest) => ({
  type: ADD_REPAIR_REQUEST,
  repairRequest
});

const updateRepairRequest = (repairRequest) => ({
  type: UPDATE_REPAIR_REQUEST,
  repairRequest
});

const deleteRepairRequest = (id) => ({
  type: DELETE_REPAIR_REQUEST,
  id
});



// Thunks
export const fetchRepairRequests = () => async (dispatch) => {
  const res = await csrfFetch('/api/repair-requests');
  const data = await res.json();
  dispatch(setRepairRequests(data));
};

export const createRepairRequest = (requestData) => async (dispatch) => {
  const res = await csrfFetch('/api/repair-requests', {
    method: 'POST',
    body: JSON.stringify(requestData),
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await res.json();
  dispatch(addRepairRequest(data));
};

export const editRepairRequest = (id, requestData) => async (dispatch) => {
  const res = await csrfFetch(`/api/repair-requests/${id}`, {
    method: 'PUT',
    body: JSON.stringify(requestData),
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await res.json();
  dispatch(updateRepairRequest(data));
};

export const removeRepairRequest = (id) => async (dispatch) => {
  await csrfFetch(`/api/repair-requests/${id}`, {
    method: 'DELETE'
  });
  dispatch(deleteRepairRequest(id));
};




// Reducer
const initialState = {};

const repairRequestsReducer = (state = initialState, action) => {
  switch (action.type) {

    case SET_REPAIR_REQUESTS: {
      const all = {};
      action.repairRequests.forEach((r) => {
        all[r.id] = r;
      });
      return all;
    }

    case ADD_REPAIR_REQUEST: {
      return { ...state, [action.repairRequest.id]: action.repairRequest };
    }

    case UPDATE_REPAIR_REQUEST: {
      return { ...state, [action.repairRequest.id]: action.repairRequest };
    }

    case DELETE_REPAIR_REQUEST: {
      const newState = { ...state };
      delete newState[action.id];
      return newState;
    }

    default:
      return state;
  }
};

export default repairRequestsReducer;

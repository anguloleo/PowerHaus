import { csrfFetch } from './csrf';

// Action Types
const LOAD_USER_METRICS = 'userMetrics/load';
const ADD_USER_METRIC = 'userMetrics/add';
const UPDATE_USER_METRIC = 'userMetrics/update';
const DELETE_USER_METRIC = 'userMetrics/delete';

// Action Creators
export const loadUserMetrics = (metrics) => ({
  type: LOAD_USER_METRICS,
  metrics
});

export const addUserMetric = (metric) => ({
  type: ADD_USER_METRIC,
  metric
});

export const updateUserMetric = (metric) => ({
  type: UPDATE_USER_METRIC,
  metric
});

export const deleteUserMetric = (metricId) => ({
  type: DELETE_USER_METRIC,
  metricId
});

// Thunks

// Fetch all metrics for a user
export const fetchUserMetrics = () => async (dispatch) => {
  const res = await csrfFetch(`/api/userMetrics`);
  if (res.ok) {
    const data = await res.json();
    dispatch(loadUserMetrics(data));
  }
};

// Add a new metric
export const createUserMetric = (metricData) => async (dispatch) => {
  const res = await csrfFetch(`/api/userMetrics`, {
    method: 'POST',
    body: JSON.stringify(metricData)
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(addUserMetric(data));
  }
};

// Update an existing metric
export const editUserMetric = (metricId, metricData) => async (dispatch) => {
  const res = await csrfFetch(`/api/userMetrics/${metricId}`, {
    method: 'PUT',
    body: JSON.stringify(metricData)
  });
  if (res.ok) {
    const data = await res.json();
    dispatch(updateUserMetric(data));
  }
};

// Delete a metric
export const removeUserMetric = (metricId) => async (dispatch) => {
  const res = await csrfFetch(`/api/userMetrics/${metricId}`, {
    method: 'DELETE'
  });
  if (res.ok) {
    dispatch(deleteUserMetric(metricId));
  }
};

// Initial State
const initialState = { entries: [] };

export default function userMetricsReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_USER_METRICS:
      return { ...state, entries: action.metrics }; // data from API is already an array

    case ADD_USER_METRIC:
      return { ...state, entries: [...state.entries, action.metric] };

    case UPDATE_USER_METRIC:
      return {
        ...state,
        entries: state.entries.map(m =>
          m.id === action.metric.id ? action.metric : m
        ),
      };

    case DELETE_USER_METRIC:
      return {
        ...state,
        entries: state.entries.filter(m => m.id !== action.metricId),
      };

    default:
      return state;
  }
}


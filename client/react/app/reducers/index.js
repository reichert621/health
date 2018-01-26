import { combineReducers } from 'redux';
import { extend } from 'lodash';
import { fetchScorecards } from '../helpers/scorecard';
import { fetchChecklists } from '../helpers/checklist';
import { mapByDate } from '../helpers/utils';

// Constants

export const LIST_VIEW = 'LIST_VIEW';
export const CHART_VIEW = 'CHART_VIEW';

export const UPDATE_VIEW = 'UPDATE_VIEW';
export const SELECT_DATE = 'SELECT_DATE';
export const REQUEST_SCORECARDS = 'REQUEST_SCORECARDS';
export const RECEIVE_SCORECARDS = 'RECEIVE_SCORECARDS';
export const REQUEST_CHECKLISTS = 'REQUEST_CHECKLISTS';
export const RECEIVE_CHECKLISTS = 'RECEIVE_CHECKLISTS';

// Actions

export const updateCurrentView = (view) => {
  return {
    view,
    type: UPDATE_VIEW
  };
};

export const selectDate = (payload) => {
  return {
    payload,
    type: SELECT_DATE
  };
};

export const getScorecards = () => {
  return (dispatch) => {
    dispatch({ type: REQUEST_SCORECARDS });

    return fetchScorecards()
      .then(scorecards => {
        return dispatch({
          type: RECEIVE_SCORECARDS,
          payload: scorecards
        });
      });
  };
};

export const getChecklists = () => {
  return (dispatch) => {
    dispatch({ type: REQUEST_CHECKLISTS });

    return fetchChecklists()
      .then(checklists => {
        return dispatch({
          type: RECEIVE_CHECKLISTS,
          payload: checklists
        });
      });
  };
};

// Reducers

const currentView = (state = LIST_VIEW, action = {}) => {
  switch (action.type) {
    case UPDATE_VIEW:
      return action.view;
    default:
      return state;
  }
};

const selected = (state = {}, action = {}) => {
  switch (action.type) {
    case SELECT_DATE:
      return extend({}, state, action.payload);
    default:
      return state;
  }
};

const scorecards = (state = {
  items: [],
  byDate: {},
  byId: {}
}, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case RECEIVE_SCORECARDS:
      return extend({}, state, {
        items: payload,
        byDate: mapByDate(payload)
      });
    default:
      return state;
  }
};

const checklists = (state = {
  items: [],
  byDate: {},
  byId: {}
}, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case RECEIVE_CHECKLISTS:
      return extend({}, state, {
        items: payload,
        byDate: mapByDate(payload)
      });
    default:
      return state;
  }
};

/**
 * State structure:
 * {
 *  currentUser: {},
 *  currentView: Chart|List,
 *  checklists: {
 *    items: [],
 *    byDate: {},
 *    byId: {}
 *  },
 *  scorecards: {
 *    items: [],
 *    byDate: {},
 *    byId: {}
 *  },
 *  selected: {
 *    scorecard: Id?,
 *    checklist: Id?,
 *    date: Date
 *  },
 *  stats: {
 *    ...
 *  }
 * }
 */

const rootReducer = combineReducers({
  currentView,
  selected,
  scorecards,
  checklists
});

export default rootReducer;

import { Dispatch } from 'redux';
import { extend } from 'lodash';
import { IAction } from './index';
import { Task } from '../helpers/tasks';
import { MappedItems, keyifyDate } from '../helpers/utils';
import {
  IScorecard,
  fetchScorecards,
  fetchScorecard,
  toggleScorecardTask,
  findOrCreateByDate as findOrCreateScorecard
} from '../helpers/scorecard';

export const REQUEST_SCORECARDS = 'REQUEST_SCORECARDS';
export const RECEIVE_SCORECARDS = 'RECEIVE_SCORECARDS';
export const REQUEST_SCORECARD = 'REQUEST_SCORECARD';
export const RECEIVE_SCORECARD = 'RECEIVE_SCORECARD';
export const UPDATE_SCORECARD = 'RECEIVE_SCORECARD';


export const getScorecards = () => {
  return (dispatch: Dispatch<IAction>) => {
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

export const getScorecard = (id: number) => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: REQUEST_SCORECARD });

    return fetchScorecard(id)
      .then(scorecard => {
        return dispatch({
          type: RECEIVE_SCORECARD,
          payload: scorecard
        });
      });
  };
};

export const getScorecardByDate = (date: string) => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: REQUEST_SCORECARD });

    return findOrCreateScorecard(date)
      .then(scorecard => {
        return dispatch({
          type: RECEIVE_SCORECARD,
          payload: scorecard
        });
      });
  };
};

export const toggleTask = (scorecard: IScorecard, task: Task) => {
  const { id: scorecardId, tasks = [] } = scorecard;
  const { id: taskId, isComplete: isCurrentlyComplete = false } = task;
  const isComplete = !isCurrentlyComplete;
  const update = {
    ...scorecard,
    tasks: tasks.map(t => {
      return t.id === taskId ? { ...t, isComplete } : t;
    })
  };

  return (dispatch: Dispatch<IAction>) => {
    // Optimistic update
    dispatch({
      type: UPDATE_SCORECARD,
      payload: update
    });

    return toggleScorecardTask(scorecardId, taskId, isComplete)
      .then(success => {
        // Do nothing, only revert if update fails
      })
      .catch(err => {
        console.log('Error toggling task!', err);
        // Revert if actual update failed
        return dispatch({
          type: UPDATE_SCORECARD,
          payload: scorecard,
          error: err // TODO: handle errors better in redux
        });
      });
  };
};

const updateWithScorecard = (state = {
  items: [],
  byDate: {},
  byId: {}
} as MappedItems<IScorecard>, scorecard: IScorecard) => {
  const { byId, byDate, items } = state;
  const { id: scorecardId, date } = scorecard;
  const existing = byId[scorecardId];
  const updated = extend({}, existing, scorecard);

  return {
    items: existing ? items : items.concat(scorecardId),
    byDate: extend({}, byDate, {
      [keyifyDate(date)]: updated
    }),
    byId: extend({}, byId, {
      [scorecardId]: updated
    })
  };
};

const updateScorecards = (state = {
  items: [],
  byDate: {},
  byId: {}
} as MappedItems<IScorecard>, scorecards: IScorecard[]) => {
  const { byId, byDate, items } = state;

  return scorecards.reduce((nextState, scorecard) => {
    return updateWithScorecard(nextState, scorecard);
  }, { items, byId, byDate });
};

const scorecards = (state = {
  items: [],
  byDate: {},
  byId: {}
} as MappedItems<IScorecard>, action = {} as IAction) => {
  const { type, payload } = action;

  switch (type) {
    case RECEIVE_SCORECARDS:
      return updateScorecards(state, payload);
    case RECEIVE_SCORECARD:
    case UPDATE_SCORECARD:
      return updateWithScorecard(state, payload);
    default:
      return state;
  }
};

export default scorecards;

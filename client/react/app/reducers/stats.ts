import { Dispatch } from 'redux';
import { IAction } from './index';
import { ReportingStats, fetchAllStats } from '../helpers/reporting';

export const REQUEST_ALL_STATS = 'REQUEST_ALL_STATS';
export const RECEIVE_ALL_STATS = 'RECEIVE_ALL_STATS';

export const getAllStats = () => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: REQUEST_ALL_STATS });

    return fetchAllStats()
      .then(stats => {
        return dispatch({
          type: RECEIVE_ALL_STATS,
          payload: stats
        });
      });
  };
};

const stats = (state = {
  // Checklist stats
  checklistStats: [],
  completedChecklists: [],
  checklistScoresByDay: {},
  depressionLevelFrequency: {},
  checklistQuestionStats: [],
  checklistScoresByTask: [],
  // Scorecard stats
  scorecardStats: [],
  completedScorecards: [],
  scorecardScoresByDay: {},
  totalScoreOverTime: [],
  taskAbilityStats: {},
  // Task stats
  topTasks: []
} as ReportingStats, action = {} as IAction) => {
  const { type, payload } = action;

  switch (type) {
    case RECEIVE_ALL_STATS:
      return payload;
    default:
      return state;
  }
};

export default stats;

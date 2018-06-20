import { Dispatch } from 'redux';
import * as moment from 'moment';
import { IAction } from './index';
import {
  ReportingStats,
  fetchAllStats,
  fetchWeekStats
} from '../helpers/reporting';

export const REQUEST_ALL_STATS = 'REQUEST_ALL_STATS';
export const RECEIVE_ALL_STATS = 'RECEIVE_ALL_STATS';
export const REQUEST_WEEK_STATS = 'REQUEST_WEEK_STATS';
export const RECEIVE_WEEK_STATS = 'RECEIVE_WEEK_STATS';

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

export const getWeekStats = (customDate?: string) => {
  let date = customDate || moment().format('YYYY-MM-DD');

  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: REQUEST_WEEK_STATS });

    return fetchWeekStats(date)
      .then(stats => {
        return dispatch({
          type: RECEIVE_WEEK_STATS,
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
  topTasks: [],
  // This week's stats
  weekStats: {}
} as ReportingStats, action = {} as IAction) => {
  const { type, payload } = action;

  switch (type) {
    case RECEIVE_ALL_STATS:
      return { ...state, ...payload };
    case RECEIVE_WEEK_STATS:
      return { ...state, weekStats: payload };
    default:
      return state;
  }
};

export default stats;

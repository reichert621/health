import { Dispatch } from 'redux';
import * as moment from 'moment';
import { IAction } from './index';
import { DATE_FORMAT } from '../helpers/utils';
import {
  ReportingStats,
  DateRange,
  fetchAllStats,
  fetchWeekStats,
  fetchMonthlyAverages
} from '../helpers/reporting';

export const REQUEST_ALL_STATS = 'REQUEST_ALL_STATS';
export const RECEIVE_ALL_STATS = 'RECEIVE_ALL_STATS';
export const REQUEST_WEEK_STATS = 'REQUEST_WEEK_STATS';
export const RECEIVE_WEEK_STATS = 'RECEIVE_WEEK_STATS';
export const REQUEST_MONTHLY_AVERAGES = 'REQUEST_MONTHLY_AVERAGES';
export const RECEIVE_MONTHLY_AVERAGES = 'RECEIVE_MONTHLY_AVERAGES';

export const getAllStats = (range?: DateRange) => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: REQUEST_ALL_STATS });

    return fetchAllStats(range)
      .then(stats => {
        return dispatch({
          type: RECEIVE_ALL_STATS,
          payload: stats
        });
      });
  };
};

export const getWeekStats = (customDate?: string) => {
  let date = customDate || moment().format(DATE_FORMAT);

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

export const getMonthlyAverages = () => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: REQUEST_MONTHLY_AVERAGES });

    return fetchMonthlyAverages()
      .then(stats => {
        return dispatch({
          type: RECEIVE_MONTHLY_AVERAGES,
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
    case RECEIVE_MONTHLY_AVERAGES:
      return { ...state, monthlyAverages: payload };
    default:
      return state;
  }
};

export default stats;

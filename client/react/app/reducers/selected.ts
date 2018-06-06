import { Dispatch } from 'redux';
import { extend } from 'lodash';
import * as moment from 'moment';
import { IAction } from './index';
import { MappedItems, SelectedState, keyifyDate } from '../helpers/utils';
import { RECEIVE_SCORECARD } from './scorecards';
import { RECEIVE_CHECKLIST } from './checklists';
import { RECEIVE_ENTRY } from './entries';
import { RECEIVE_MOOD } from './moods';
import { RECEIVE_ASSESSMENT } from './assessments';

export const SELECT_DATE = 'SELECT_DATE';

export const selectDate = (payload: SelectedState) => {
  return {
    payload,
    type: SELECT_DATE
  };
};

const selected = (state = {} as SelectedState, action = {} as IAction) => {
  const { type, payload } = action;

  switch (type) {
    case SELECT_DATE:
      return extend({}, state, payload);
    case RECEIVE_SCORECARD:
      // TODO: refactor to use spread operator
      return extend({}, state, {
        date: moment(payload.date),
        scorecard: extend(state.scorecard || {}, payload)
      });
    case RECEIVE_CHECKLIST:
      return extend({}, state, {
        date: moment(payload.date),
        checklist: extend(state.checklist || {}, payload)
      });
    case RECEIVE_ENTRY:
      return extend({}, state, {
        date: moment(payload.date),
        entry: extend(state.entry || {}, payload)
      });
    case RECEIVE_MOOD:
      // TODO: handle this better
      return (payload && payload.date) ? extend({}, state, {
        date: moment(payload.date),
        mood: extend(state.mood || {}, payload)
      }) : state;
    case RECEIVE_ASSESSMENT:
      // TODO: include date here as well
      return {
        ...state,
        assessments: { ...state.assessments, ...payload }
      };
    default:
      return state;
  }
};

export default selected;

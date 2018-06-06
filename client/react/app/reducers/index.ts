import { combineReducers } from 'redux';
import currentUser from './current-user';
import currentView from './current-view';
import selected from './selected';
import scorecards from './scorecards';
import checklists from './checklists';
import questions from './questions';
import challenges from './challenges';
import entries from './entries';
import moods from './moods';
import assessments from './assessments';
import stats from './stats';

export interface IAction {
  type: string;
  payload?: any; // TODO: use generic type?
}

/**
 * State structure:
 * {
 *  currentUser: {},
 *  currentView: Chart|List,
 *  selected: {
 *    scorecard: Id?,
 *    checklist: Id?,
 *    date: Date
 *  },
 *  checklists|scorecards|entries|etc: {
 *    items: [],
 *    byDate: {},
 *    byId: {}
 *  },
 *  stats: {
 *    ...
 *  }
 * }
 */

const rootReducer = combineReducers({
  currentUser,
  currentView,
  selected,
  scorecards,
  checklists,
  assessments,
  entries,
  questions,
  challenges,
  moods,
  stats
});

export default rootReducer;

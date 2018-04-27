import { Dispatch, combineReducers } from 'redux';
import * as moment from 'moment';
import { extend, merge } from 'lodash';
// TODO: split reducers into separate files
import { IUser, fetchCurrentUser } from '../helpers/auth';
import {
  IScorecard,
  fetchScorecards,
  fetchScorecard,
  toggleScorecardTask,
  findOrCreateByDate as findOrCreateScorecard
} from '../helpers/scorecard';
import {
  IChecklist,
  IQuestion,
  fetchChecklists,
  fetchChecklist,
  updateChecklistScore,
  findOrCreateByDate as findOrCreateChecklist
} from '../helpers/checklist';
import { Task } from '../helpers/tasks';
import {
  Entry,
  fetchEntries,
  fetchEntry,
  findOrCreateByDate as findOrCreateEntry
} from '../helpers/entries';
import { ReportingStats, fetchAllStats } from '../helpers/reporting';
import {
  IChallenge,
  fetchAllChallenges,
  fetchMyChallenges,
  fetchByDate as fetchChallengesByDate,
  toggleChallengeByDate
} from '../helpers/challenges';
import {
  SelectedState,
  ChallengeState,
  MappedItems,
  mapByDate,
  mapById,
  keyifyDate
} from '../helpers/utils';

// Constants

export const LIST_VIEW = 'LIST_VIEW';
export const CHART_VIEW = 'CHART_VIEW';

export const UPDATE_VIEW = 'UPDATE_VIEW';
export const SELECT_DATE = 'SELECT_DATE';

export const REQUEST_SCORECARDS = 'REQUEST_SCORECARDS';
export const RECEIVE_SCORECARDS = 'RECEIVE_SCORECARDS';
export const REQUEST_SCORECARD = 'REQUEST_SCORECARD';
export const RECEIVE_SCORECARD = 'RECEIVE_SCORECARD';
export const UPDATE_SCORECARD = 'RECEIVE_SCORECARD';

export const REQUEST_CHECKLISTS = 'REQUEST_CHECKLISTS';
export const RECEIVE_CHECKLISTS = 'RECEIVE_CHECKLISTS';
export const REQUEST_CHECKLIST = 'REQUEST_CHECKLIST';
export const RECEIVE_CHECKLIST = 'RECEIVE_CHECKLIST';
export const UPDATE_CHECKLIST = 'UPDATE_CHECKLIST';

export const REQUEST_ENTRIES = 'REQUEST_ENTRIES';
export const RECEIVE_ENTRIES = 'RECEIVE_ENTRIES';
export const REQUEST_ENTRY = 'REQUEST_ENTRY';
export const RECEIVE_ENTRY = 'RECEIVE_ENTRY';

export const REQUEST_CURRENT_USER = 'REQUEST_CURRENT_USER';
export const RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';

export const REQUEST_CHALLENGES = 'REQUEST_CHALLENGES';
export const RECEIVE_CHALLENGES = 'RECEIVE_CHALLENGES';
export const REQUEST_ALL_CHALLENGES = 'REQUEST_ALL_CHALLENGES';
export const RECEIVE_ALL_CHALLENGES = 'RECEIVE_ALL_CHALLENGES';
export const REQUEST_MY_CHALLENGES = 'REQUEST_MY_CHALLENGES';
export const RECEIVE_MY_CHALLENGES = 'RECEIVE_MY_CHALLENGES';
export const UPDATE_CHALLENGE = 'UPDATE_CHALLENGE';

export const REQUEST_ALL_STATS = 'REQUEST_ALL_STATS';
export const RECEIVE_ALL_STATS = 'RECEIVE_ALL_STATS';

// Actions

interface IAction {
  type: string;
  payload?: any; // TODO: use generic type?
}

interface ViewAction extends IAction {
  view: string;
}

export const updateCurrentView = (view: string) => {
  return {
    view,
    type: UPDATE_VIEW
  };
};

export const selectDate = (payload: SelectedState) => {
  return {
    payload,
    type: SELECT_DATE
  };
};

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

export const getChecklists = () => {
  return (dispatch: Dispatch<IAction>) => {
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

export const getChecklist = (id: number) => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: REQUEST_CHECKLIST });

    return fetchChecklist(id)
      .then(checklist => {
        return dispatch({
          type: RECEIVE_CHECKLIST,
          payload: checklist
        });
      });
  };
};

export const getChecklistByDate = (date: string) => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: REQUEST_CHECKLIST });

    return findOrCreateChecklist(date)
      .then(checklist => {
        return dispatch({
          type: RECEIVE_CHECKLIST,
          payload: checklist
        });
      });
  };
};

export const updateScore = (
  checklist: IChecklist,
  question: IQuestion,
  score: number
) => {
  return (dispatch: Dispatch<IAction>) => {
    const { id: checklistId, questions = [] } = checklist;
    const { id: questionId } = question;

    return updateChecklistScore(checklistId, questionId, score)
      .then(() => {
        const update = {
          ...checklist,
          questions: questions.map(q => {
            return (q.id === questionId) ? { ...q, score } : q;
          })
        };

        return dispatch({
          type: UPDATE_CHECKLIST,
          payload: update
        });
      })
      .catch(err => {
        // TODO: improve error handling in redux
        console.log('Error updating score!', err);
      });
  };
};

export const getEntries = () => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: REQUEST_ENTRIES });

    return fetchEntries()
      .then(entries => {
        return dispatch({
          type: RECEIVE_ENTRIES,
          payload: entries
        });
      });
  };
};

export const getEntry = (id: number) => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: REQUEST_ENTRY });

    return fetchEntry(id)
      .then(entry => {
        return dispatch({
          type: RECEIVE_ENTRY,
          payload: entry
        });
      });
  };
};

export const getEntryByDate = (date: string) => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: REQUEST_ENTRY });

    return findOrCreateEntry(date)
      .then(entry => {
        return dispatch({
          type: RECEIVE_ENTRY,
          payload: entry
        });
      });
  };
};

export const getCurrentUser = () => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: REQUEST_CURRENT_USER });

    return fetchCurrentUser()
      .then(user => {
        return dispatch({
          type: RECEIVE_CURRENT_USER,
          payload: user
        });
      });
  };
};

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

export const getAllChallenges = () => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: REQUEST_ALL_CHALLENGES });

    return fetchAllChallenges()
      .then(challenges => {
        return dispatch({
          type: RECEIVE_ALL_CHALLENGES,
          payload: challenges
        });
      });
  };
};

export const getMyChallenges = () => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: REQUEST_MY_CHALLENGES });

    return fetchMyChallenges()
      .then(challenges => {
        return dispatch({
          type: RECEIVE_MY_CHALLENGES,
          payload: challenges
        });
      });
  };
};

export const getChallengesByDate = (date: string) => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: REQUEST_CHALLENGES });

    return fetchChallengesByDate(date)
      .then(challenges => {
        return dispatch({
          type: RECEIVE_CHALLENGES,
          payload: { date, challenges }
        });
      });
  };
};

// Reducers

const currentUser = (state = null as IUser, action = {} as IAction) => {
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      return action.payload;
    default:
      return state;
  }
};

const currentView = (state = LIST_VIEW, action = {} as ViewAction) => {
  switch (action.type) {
    case UPDATE_VIEW:
      return action.view;
    default:
      return state;
  }
};

const selected = (state = {} as SelectedState, action = {} as IAction) => {
  const { type, payload } = action;

  switch (type) {
    case SELECT_DATE:
      return extend({}, state, payload);
    case RECEIVE_SCORECARD:
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
    default:
      return state;
  }
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

const updateWithChecklist = (state = {
  items: [],
  byDate: {},
  byId: {}
} as MappedItems<IChecklist>, checklist: IChecklist) => {
  const { byId, byDate, items } = state;
  const { id: checklistId, date } = checklist;
  const existing = byId[checklistId];
  const updated = extend({}, existing, checklist);

  return {
    items: existing ? items : items.concat(checklistId),
    byDate: extend({}, byDate, {
      [keyifyDate(date)]: updated
    }),
    byId: extend({}, byId, {
      [checklistId]: updated
    })
  };
};

const updateChecklists = (state = {
  items: [],
  byDate: {},
  byId: {}
} as MappedItems<IChecklist>, checklists: IChecklist[]) => {
  const { byId, byDate, items } = state;

  return checklists.reduce((nextState, checklist) => {
    return updateWithChecklist(nextState, checklist);
  }, { items, byId, byDate });
};

const checklists = (state = {
  items: [],
  byDate: {},
  byId: {}
} as MappedItems<IChecklist>, action = {} as IAction) => {
  const { items, byDate, byId } = state;
  const { type, payload } = action;

  switch (type) {
    case RECEIVE_CHECKLISTS:
      return updateChecklists(state, payload);
    case RECEIVE_CHECKLIST:
    case UPDATE_CHECKLIST:
      return updateWithChecklist(state, payload);
    default:
      return state;
  }
};

const questions = (state = [] as IQuestion[], action = {} as IAction) => {
  const { type, payload } = action;

  switch (type) {
    case RECEIVE_CHECKLIST:
      return payload.questions.map((question: IQuestion) => {
        const { id, text, category } = question;

        return { id, text, category };
      });
    default:
      return state;
  }
};

// TODO: clean/DRY up
const updateWithEntry = (state = {
  items: [],
  byDate: {},
  byId: {}
} as MappedItems<Entry>, entry: Entry) => {
  const { byId, byDate, items } = state;
  const { id: entryId, date } = entry;
  const existing = byId[entryId];
  const updated = extend({}, existing, entry);

  return {
    items: existing ? items : items.concat(entryId),
    byDate: extend({}, byDate, {
      [keyifyDate(date)]: updated
    }),
    byId: extend({}, byId, {
      [entryId]: updated
    })
  };
};

const updateEntries = (state = {
  items: [],
  byDate: {},
  byId: {}
} as MappedItems<Entry>, entries: Entry[]) => {
  const { byId, byDate, items } = state;

  return entries.reduce((nextState, entry) => {
    return updateWithEntry(nextState, entry);
  }, { items, byId, byDate });
};

const entries = (state = {
  items: [],
  byDate: {},
  byId: {}
} as MappedItems<Entry>, action = {} as IAction) => {
  const { items, byDate, byId } = state;
  const { type, payload } = action;

  switch (type) {
    case RECEIVE_ENTRIES:
      return updateEntries(state, payload);
    case RECEIVE_ENTRY:
      return updateWithEntry(state, payload);
    default:
      return state;
  }
};

const updateWithChallenge = (
  state: ChallengeState,
  payload: { date: string, challenge: IChallenge },
) => {
  const { byDate } = state;
  const { date, challenge } = payload;
  const key = keyifyDate(date);
  const existing = byDate[key];

  return {
    ...state,
    byDate: {
      [key]: existing.map(original => {
        return (original.id === challenge.id) ? challenge : original;
      })
    }
  };
};

const challenges = (state = {
  all: [],
  mine: [],
  byDate: {}
} as ChallengeState, action = {} as IAction) => {
  const { mine = [], byDate = {} } = state;
  const { type, payload } = action;

  switch (type) {
    case RECEIVE_CHALLENGES:
      return {
        ...state,
        byDate: {
          ...byDate,
          [keyifyDate(payload.date)]: payload.challenges
        }
      };
    case RECEIVE_ALL_CHALLENGES:
      return { ...state, all: payload };
    case RECEIVE_MY_CHALLENGES:
      return { ...state, mine: payload };
    case UPDATE_CHALLENGE:
      // TODO: make this better
      return updateWithChallenge(state, payload);
    default:
      return state;
  }
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
 *  entries: {
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
  currentUser,
  currentView,
  selected,
  scorecards,
  checklists,
  entries,
  questions,
  challenges,
  stats
});

export default rootReducer;

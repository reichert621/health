import { Dispatch } from 'redux';
import { extend } from 'lodash';
import { IAction } from './index';
import { MappedItems, keyifyDate } from '../helpers/utils';
import {
  IChecklist,
  IQuestion,
  fetchChecklists,
  fetchChecklist,
  updateChecklistScore,
  findOrCreateByDate as findOrCreateChecklist
} from '../helpers/checklist';

export const REQUEST_CHECKLISTS = 'REQUEST_CHECKLISTS';
export const RECEIVE_CHECKLISTS = 'RECEIVE_CHECKLISTS';
export const REQUEST_CHECKLIST = 'REQUEST_CHECKLIST';
export const RECEIVE_CHECKLIST = 'RECEIVE_CHECKLIST';
export const UPDATE_CHECKLIST = 'UPDATE_CHECKLIST';

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

export default checklists;

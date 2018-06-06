import { Dispatch } from 'redux';
import { IAction } from './index';
import { MappedItems, keyifyDate } from '../helpers/utils';
import {
  IMood,
  findMoodByDate,
  fetchUserMoods,
  setMoodByDate as updateMoodByDate
} from '../helpers/mood';

export const REQUEST_MOOD = 'REQUEST_MOOD';
export const RECEIVE_MOOD = 'RECEIVE_MOOD';
export const REQUEST_MOODS = 'REQUEST_MOODS';
export const RECEIVE_MOODS = 'RECEIVE_MOODS';

export const getUserMoods = () => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: REQUEST_MOODS });

    return fetchUserMoods()
      .then(moods => {
        return dispatch({
          type: RECEIVE_MOODS,
          payload: moods
        });
      });
  };
};

export const getMoodByDate = (date: string) => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: REQUEST_MOOD });

    return findMoodByDate(date)
      .then(mood => {
        return dispatch({
          type: RECEIVE_MOOD,
          payload: mood
        });
      });
  };
};

export const setMoodByDate = (date: string, moodId: number) => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: REQUEST_MOOD });

    return updateMoodByDate(date, moodId)
      .then(mood => {
        return dispatch({
          type: RECEIVE_MOOD,
          payload: mood
        });
      });
  };
};

const updateMoods = (state: MappedItems<IMood>, moods: IMood[]) => {
  const { byDate } = state;

  return moods.reduce((nextState, mood) => {
    const { byDate: nextByDate } = nextState;
    const { date } = mood;
    const key = keyifyDate(date);

    return {
      byDate: {
        ...nextByDate,
        [key]: mood
      }
    };
  }, { byDate });
};

const moods = (state = {
  byDate: {}
} as MappedItems<IMood>, action = {} as IAction) => {
  const { byDate = {} } = state;
  const { type, payload } = action;

  switch (type) {
    case RECEIVE_MOODS:
      return updateMoods(state, payload);
    case RECEIVE_MOOD:
      // TODO: handle this better
      return (payload && payload.date) ? {
        ...state,
        byDate: {
          ...byDate,
          [keyifyDate(payload.date)]: payload
        }
      } : state;
    default:
      return state;
  }
};

export default moods;

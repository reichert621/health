import { Dispatch } from 'redux';
// import { extend } from 'lodash';
import { IAction } from './index';
import { MappedItems, ChallengeState, keyifyDate } from '../helpers/utils';
import {
  IChallenge,
  fetchActiveChallenges,
  fetchMyChallenges,
  fetchByDate as fetchChallengesByDate,
  toggleChallengeByDate
} from '../helpers/challenges';

export const REQUEST_CHALLENGES = 'REQUEST_CHALLENGES';
export const RECEIVE_CHALLENGES = 'RECEIVE_CHALLENGES';
export const REQUEST_ALL_CHALLENGES = 'REQUEST_ALL_CHALLENGES';
export const RECEIVE_ALL_CHALLENGES = 'RECEIVE_ALL_CHALLENGES';
export const REQUEST_MY_CHALLENGES = 'REQUEST_MY_CHALLENGES';
export const RECEIVE_MY_CHALLENGES = 'RECEIVE_MY_CHALLENGES';
export const UPDATE_CHALLENGE = 'UPDATE_CHALLENGE';

export const getActiveChallenges = () => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: REQUEST_ALL_CHALLENGES });

    return fetchActiveChallenges()
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

export default challenges;

import { Dispatch } from 'redux';
import { IAction } from './index';
import { IUser, fetchCurrentUser } from '../helpers/auth';

export const REQUEST_CURRENT_USER = 'REQUEST_CURRENT_USER';
export const RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';

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

const currentUser = (state = null as IUser, action = {} as IAction) => {
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      return action.payload;
    default:
      return state;
  }
};

export default currentUser;

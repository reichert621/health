import { IAction } from './index';

export interface ViewAction extends IAction {
  view: string;
}

export const LIST_VIEW = 'LIST_VIEW';
export const CHART_VIEW = 'CHART_VIEW';
export const UPDATE_VIEW = 'UPDATE_VIEW';

export const updateCurrentView = (view: string) => {
  return {
    view,
    type: UPDATE_VIEW
  };
};

const currentView = (state = LIST_VIEW, action = {} as ViewAction) => {
  switch (action.type) {
    case UPDATE_VIEW:
      return action.view;
    default:
      return state;
  }
};

export default currentView;

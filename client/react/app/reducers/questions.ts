import { IAction } from './index';
import { IQuestion } from '../helpers/checklist';
import { RECEIVE_CHECKLIST } from './checklists';

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

export default questions;

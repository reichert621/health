import { Dispatch } from 'redux';
import { mapValues, groupBy, isEqual } from 'lodash';
import { IAction } from './index';
import { MappedItems, keyifyDate } from '../helpers/utils';
import {
  IAssessment,
  fetchAssessments,
  fetchAssessmentsByDate
} from '../helpers/assessment';

export const REQUEST_ASSESSMENTS = 'REQUEST_ASSESSMENTS';
export const RECEIVE_ASSESSMENTS = 'RECEIVE_ASSESSMENTS';
export const REQUEST_ASSESSMENT = 'REQUEST_ASSESSMENT';
export const RECEIVE_ASSESSMENT = 'RECEIVE_ASSESSMENT';

export const getAssessments = () => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: REQUEST_ASSESSMENTS });

    return fetchAssessments()
      .then(assessmentsByType => {
        return dispatch({
          type: RECEIVE_ASSESSMENTS,
          payload: assessmentsByType
        });
      });
  };
};

export const getAssessmentsByDate = (date: string) => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: REQUEST_ASSESSMENT });

    return fetchAssessmentsByDate(date)
      .then(assessments => {
        return dispatch({
          type: RECEIVE_ASSESSMENT,
          payload: assessments
        });
      });
  };
};


// TODO: fix `any` type
const updateAssessments = (state = {
  items: [],
  byDate: {},
  byId: {}
} as MappedItems<any>, assessmentsByType: { [type: string]: IAssessment[] }) => {
  const { byId, byDate, items } = state;
  const { wellbeing, anxiety, depression } = assessmentsByType;
  const all = wellbeing.concat(anxiety).concat(depression);
  const assessmentsByDate = groupBy(all, ({ date }) => keyifyDate(date));

  return {
    items: all,
    byId: all.reduce((mappings, assessment) => {
      const { id } = assessment;

      return { ...mappings, [id]: assessment };
    }, {}),
    byDate: mapValues(assessmentsByDate, (assessments) => {
      return assessments.reduce((mappings, assessment) => {
        const { type } = assessment;

        return { ...mappings, [type]: assessment };
      }, {});
    })
  };
};

interface AssessmentsByDate {
  [type: string]: IAssessment;
}

const updateAssessmentsByDate = (state = {
  items: [],
  byDate: {},
  byId: {}
} as MappedItems<any>, assessments: any) => {
  const { byId, byDate, items } = state;
  const { wellbeing, anxiety, depression } = assessments;
  // TODO: make this more clear
  const updates = [wellbeing, anxiety, depression].filter(assessment => {
    const existing = assessment && assessment.id && byId[assessment.id];

    return assessment || !isEqual(assessment, existing);
  });

  if (!updates || !updates.length) {
    return state;
  }

  const [d] = updates.map(a => a.date);
  const date = keyifyDate(d);

  return {
    items: items.concat(updates),
    byId: updates.reduce((mappings, assessment) => {
      const { id } = assessment;

      return { ...mappings, [id]: assessment };
    }, byId),
    byDate: {
      ...byDate,
      [date]: updates.reduce((types, assessment) => {
        const { type } = assessment;

        return { ...types, [type]: assessment };
      }, byDate[date])
    }
  };
};

const assessments = (state = {
  items: [],
  byDate: {},
  byId: {}
} as MappedItems<any>, action = {} as IAction) => {
  const { items, byDate, byId } = state;
  const { type, payload } = action;

  switch (type) {
    case RECEIVE_ASSESSMENTS:
      return updateAssessments(state, payload);
    case RECEIVE_ASSESSMENT:
      return updateAssessmentsByDate(state, payload);
    default:
      return state;
  }
};

export default assessments;

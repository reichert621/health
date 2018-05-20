import { HttpResponse, get, post } from './http';

export interface IChecklist {
  id: number;
  userId: number;
  date: string;
  points?: number;
  questions: IQuestion[];
}

export interface IChecklistScore {
  id: number;
  userId: number;
  checklistId: number;
  checklistQuestionId: number;
  score: number;
}

export interface IQuestion {
  id: number;
  checklistScoreId: number;
  text: string;
  category: string;
  score: number;
}

export interface ChecklistScore {
  id: number;
  userId: number;
  checklistId: number;
  checklistQuestionId: number;
  score: number;
}

export enum DepressionLevel {
  NONE = 'No depression',
  NORMAL = 'Normal but unhappy',
  MILD = 'Mild depression',
  MODERATE = 'Moderate depression',
  SEVERE = 'Severe depression',
  EXTREME = 'Extreme depression'
}

export const getDepressionLevelByScore = (score: number): string => {
  if (score <= 5) {
    return DepressionLevel.NONE;
  } else if (score >= 6 && score <= 10) {
    return DepressionLevel.NORMAL;
  } else if (score >= 11 && score <= 25) {
    return DepressionLevel.MILD;
  } else if (score >= 26 && score <= 50) {
    return DepressionLevel.MODERATE;
  } else if (score >= 51 && score <= 75) {
    return DepressionLevel.SEVERE;
  } else {
    return DepressionLevel.EXTREME;
  }
};

export const fetchChecklists = (): Promise<IChecklist[]> => {
  return get('/api/checklists')
    .then((res: HttpResponse) => res.checklists);
};

export const fetchChecklist = (id: number): Promise<IChecklist> => {
  return get(`/api/checklists/${id}`)
    .then((res: HttpResponse) => res.checklist);
};

export const findOrCreateByDate = (date: string): Promise<IChecklist> => {
  return post('/api/checklists/date', { date })
    .then((res: HttpResponse) => res.checklist);
};

export const updateChecklistScore = (
  id: number,
  questionId: number,
  score: number
): Promise<IChecklistScore> => {
  return post(`/api/checklists/${id}/questions/${questionId}/score`, { score })
    .then((res: HttpResponse) => res.checklistScore);
};

export const updateChecklistScores = (id: number, params: object): Promise<IChecklist> => {
  return post(`/api/checklists/${id}/update-scores`, params)
    .then((res: HttpResponse) => res.updates);
};

// TODO: returns object or array?
export const fetchChecklistStats = (): Promise<Object> => {
  return get('/api/stats/checklists')
    .then((res: HttpResponse) => res.stats);
};

export const createNewChecklist = (params: object): Promise<IChecklist> => {
  return post('/api/checklists/new', params)
    .then((res: HttpResponse) => res.checklist);
};

export const fetchChecklistScores = (): Promise<ChecklistScore[]> => {
  return get('/api/checklist-scores')
    .then((res: HttpResponse) => res.scores);
};

export const fetchChecklistQuestions = (): Promise<IQuestion[]> => {
  return get('/api/checklist-questions')
    .then((res: HttpResponse) => res.questions);
};

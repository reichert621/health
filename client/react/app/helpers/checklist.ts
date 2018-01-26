import { HttpResponse, get, post } from './http';

export interface IChecklist {
  id: number;
  userId: number;
  date: string;
  questions: IQuestion[];
}

export interface IQuestion {
  id: number;
  checklistScoreId: number;
  text: string;
  score: number;
}

export const fetchChecklists = (): Promise<IChecklist[]> => {
  return get('/api/checklists')
    .then((res: HttpResponse) => res.checklists);
};

export const fetchChecklist = (id: number): Promise<IChecklist> => {
  return get(`/api/checklists/${id}`)
    .then((res: HttpResponse) => res.checklist);
};

// TODO: don't use `any`!
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

export interface ChecklistScore {
  id: number;
  userId: number;
  checklistId: number;
  checklistQuestionId: number;
  score: number;
}

export const fetchChecklistScores = (): Promise<ChecklistScore[]> => {
  return get('/api/checklist-scores')
    .then((res: HttpResponse) => res.scores);
};

export interface IChecklistQuestion {
  id: number;
  text: string;
  category?: string;
}

export const fetchChecklistQuestions = (): Promise<IChecklistQuestion[]> => {
  return get('/api/checklist-questions')
    .then((res: HttpResponse) => res.questions);
};

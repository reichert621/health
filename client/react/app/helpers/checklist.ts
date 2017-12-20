import { HttpResponse, get, post } from './http';

export interface Checklist {
  id: number;
  userId: number;
  date: string;
}

export const fetchChecklist = (id: number): Promise<Checklist> => {
  return get(`/api/checklists/${id}`)
    .then((res: HttpResponse) => res.checklist);
};

// TODO: don't use `any`!
export const updateChecklistScores = (id: number, params: object): Promise<Checklist> => {
  return post(`/api/checklists/${id}/update-scores`, params)
    .then((res: HttpResponse) => res.updates);
};

// TODO: returns object or array?
export const fetchChecklistStats = (): Promise<Object> => {
  return get(`/api/stats/checklists`)
    .then((res: HttpResponse) => res.stats);
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

export interface ChecklistQuestion {
  id: number;
  text: string;
  category?: string;
}

export const fetchChecklistQuestions = (): Promise<ChecklistQuestion[]> => {
  return get('/api/checklist-questions')
    .then((res: HttpResponse) => res.questions);
};

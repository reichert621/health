import { HttpResponse, get, post, put, del } from './http';
import { Task } from './tasks';

export interface Scorecard {
  id: number;
  userId: number;
  date: string;
  title?: string;
  tasks?: Task[];
}

export const fetchScorecards = (): Promise<Scorecard[]> => {
  return get('/api/scorecards')
    .then((res: HttpResponse) => res.scorecards);
};

export const fetchScorecard = (id: number): Promise<Scorecard> => {
  return get(`/api/scorecards/${id}`)
    .then((res: HttpResponse) => res.scorecard);
};

export const updateScoreCard = (id: number, params: object): Promise<Scorecard> => {
  return put(`/api/scorecards/${id}`, params)
    .then((res: HttpResponse) => res.scorecard);
};

// TODO: don't use `any`!
export const updateScoreCardSelectedTasks = (id: number, params: object): Promise<any> => {
  return post(`/api/scorecards/${id}/update-selected-tasks`, params)
    .then((res: HttpResponse) => res.updates);
};

export const selectScorecardTask = (id: number, taskId: number): Promise<boolean> => {
  return post(`/api/scorecards/${id}/select-task/${taskId}`)
    .then((res: HttpResponse) => res.success);
};

export const deselectScorecardTask = (id: number, taskId: number): Promise<boolean> => {
  return del(`/api/scorecards/${id}/deselect-task/${taskId}`)
    .then((res: HttpResponse) => res.success);
};

export const toggleScorecardTask = (
  id: number,
  taskId: number,
  isComplete: boolean
): Promise<boolean> => {
  return isComplete ?
    selectScorecardTask(id, taskId) :
    deselectScorecardTask(id, taskId);
};

// TODO: returns object or array?
export const fetchScorecardStats = (): Promise<Object> => {
  return get(`/api/stats/scorecards`)
    .then((res: HttpResponse) => res.stats);
};

export const createNewScorecard = (params: object): Promise<Scorecard> => {
  return post('/api/scorecards/new', params)
    .then((res: HttpResponse) => res.scorecard);
};

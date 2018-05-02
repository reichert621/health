import { HttpResponse, get, post, put, del } from './http';
import { Task } from './tasks';

export interface IScorecard {
  id: number;
  userId: number;
  date: string;
  title?: string;
  points?: number;
  tasks?: Task[];
}

export const fetchScorecards = (): Promise<IScorecard[]> => {
  return get('/api/scorecards')
    .then((res: HttpResponse) => res.scorecards);
};

export const fetchScorecard = (id: number): Promise<IScorecard> => {
  return get(`/api/scorecards/${id}`)
    .then((res: HttpResponse) => res.scorecard);
};

export const fetchProgressToday = (): Promise<any> => {
  return get(`/api/scorecards/progress-today`)
    .then((res: HttpResponse) => res.scores);
};

export const findOrCreateByDate = (date: string): Promise<IScorecard> => {
  return post('/api/scorecards/date', { date })
    .then((res: HttpResponse) => res.scorecard);
};

export const updateScorecard = (id: number, params: object): Promise<IScorecard> => {
  return put(`/api/scorecards/${id}`, params)
    .then((res: HttpResponse) => res.scorecard);
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

export const createNewScorecard = (params: object): Promise<IScorecard> => {
  return post('/api/scorecards/new', params)
    .then((res: HttpResponse) => res.scorecard);
};

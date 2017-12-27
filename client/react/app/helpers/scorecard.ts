import { HttpResponse, get, post } from './http';

export interface Scorecard {
  id: number;
  userId: number;
  date: string;
  title?: string;
}

export const fetchScorecards = (): Promise<Scorecard[]> => {
  return get('/api/scorecards')
    .then((res: HttpResponse) => res.scorecards);
};

export const fetchScorecard = (id: number): Promise<Scorecard> => {
  return get(`/api/scorecards/${id}`)
    .then((res: HttpResponse) => res.scorecard);
};

// TODO: don't use `any`!
export const updateScoreCardSelectedTasks = (id: number, params: object): Promise<any> => {
  return post(`/api/scorecards/${id}/update-selected-tasks`, params)
    .then((res: HttpResponse) => res.updates);
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

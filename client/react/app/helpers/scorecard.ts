import { HttpResponse, get, post } from './http';

export interface Scorecard {
  id: number;
  userId: number;
  date: string;
  title?: string;
}

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
export const fetchScorecardtStats = (): Promise<Object> => {
  return get(`/api/stats/scorescards`)
    .then((res: HttpResponse) => res.stats);
};

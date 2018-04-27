import { find, defaults } from 'lodash';
import * as moment from 'moment';
import { HttpResponse, get, post, put, del } from './http';

export interface IAccomplisher {
  username: string;
  email: string;
}

export interface IChallenge {
  id?: number;
  description: string;
  isActive: boolean;
  isComplete?: boolean;
  text?: string;
  accomplishers?: IAccomplisher[];
}

export const fetchAllChallenges = (): Promise<IChallenge[]> => {
  return get('/api/challenges')
    .then((res: HttpResponse) => res.challenges);
};

export const fetchMyChallenges = (): Promise<IChallenge[]> => {
  return get('/api/challenges/mine')
    .then((res: HttpResponse) => res.challenges);
};

export const fetchByDate = (date: string): Promise<IChallenge[]> => {
  return get(`/api/challenges/date/${date}`)
    .then((res: HttpResponse) => res.challenges);
};

export const createChallenge = (params: object): Promise<IChallenge> => {
  return post('/api/challenges', params)
    .then((res: HttpResponse) => res.challenge);
};

export const updateChallenge = (id: number, params: object): Promise<IChallenge> => {
  return put(`/api/challenges/${id}`, params)
    .then((res: HttpResponse) => res.challenge);
};

export const deleteChallenge = (id: number): Promise<IChallenge> => {
  return del(`/api/challenges/${id}`)
    .then((res: HttpResponse) => res.challenge);
};

export const selectChallenge = (id: number, date: string): Promise<boolean> => {
  return post(`/api/challenges/${id}/select`, { date })
    .then((res: HttpResponse) => res.success);
};

export const deselectChallenge = (id: number, date: string): Promise<boolean> => {
  return post(`/api/challenges/${id}/deselect`, { date })
    .then((res: HttpResponse) => res.success);
};

export const toggleChallengeByDate = (
  id: number,
  date: string,
  isComplete: boolean
): Promise<boolean> => {
  return isComplete ?
    selectChallenge(id, date) :
    deselectChallenge(id, date);
};

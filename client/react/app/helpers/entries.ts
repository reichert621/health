import * as moment from 'moment';
import { HttpResponse, get, post, put, del } from './http';

export interface Entry {
  id: number;
  userId: number;
  title: string;
  date: string;
  content: string;
  isPrivate: boolean;
}

export const fetchEntries = (): Promise<Entry[]> => {
  return get('/api/entries')
    .then((res: HttpResponse) => res.entries);
};

export const fetchUserEntries = (username: string): Promise<Entry[]> => {
  return get(`/api/users/${username}/entries`)
    .then((res: HttpResponse) => res.entries);
};

export const fetchUserEntry = (username: string, entryId: number): Promise<Entry> => {
  return get(`/api/users/${username}/entries/${entryId}`)
    .then((res: HttpResponse) => res.entry);
};

export const fetchEntry = (id: number): Promise<Entry> => {
  return get(`/api/entries/${id}`)
    .then((res: HttpResponse) => res.entry);
};

export const findOrCreateByDate = (date: string): Promise<Entry> => {
  return post('/api/entries/date', { date })
    .then((res: HttpResponse) => res.entry);
};

export const createEntry = (params: object): Promise<Entry> => {
  return post('/api/entries', params)
    .then((res: HttpResponse) => res.entry);
};

export const updateEntry = (id: number, params: object): Promise<Entry> => {
  return put(`/api/entries/${id}`, params)
    .then((res: HttpResponse) => res.entry);
};

export const deleteEntry = (id: number): Promise<Entry> => {
  return del(`/api/entries/${id}`)
    .then((res: HttpResponse) => res.entry);
};

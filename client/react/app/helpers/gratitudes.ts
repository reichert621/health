import { find, defaults } from 'lodash';
import * as moment from 'moment';
import { HttpResponse, get, post, put, del } from './http';
import { keyifyDate } from './utils';

export interface IGratitude {
  id?: number;
  userId?: number;
  date?: string;
  text: string;
}

export const fetchGratitudes = (): Promise<IGratitude[]> => {
  return get('/api/gratitudes')
    .then((res: HttpResponse) => res.gratitudes);
};

export const createGratitude = (params: object): Promise<IGratitude> => {
  return post('/api/gratitudes', params)
    .then((res: HttpResponse) => res.gratitude);
};

export const updateGratitude = (id: number, params: object): Promise<IGratitude> => {
  return put(`/api/gratitudes/${id}`, params)
    .then((res: HttpResponse) => res.gratitude);
};

export const deleteGratitude = (id: number): Promise<IGratitude> => {
  return del(`/api/gratitudes/${id}`)
    .then((res: HttpResponse) => res.gratitude);
};

export const createOrUpdate = (gratitude: IGratitude): Promise<IGratitude> => {
  const { id, date, text } = gratitude;
  const params = defaults({ date, text }, {
    date: moment().format('YYYY-MM-DD')
  });

  return id ? updateGratitude(id, params) : createGratitude(params);
};

export const getDefaultGratitude = (): IGratitude => {
  return { text: '', date: moment().format('YYYY-MM-DD') };
};

export const getTodaysGratitude = (gratitudes: IGratitude[]) => {
  return find(gratitudes, ({ date }) => {
    return keyifyDate(date) === keyifyDate(moment());
  });
};

export const getRecentPastGratitudes = (
  gratitudes: IGratitude[],
  current?: IGratitude
): IGratitude[] => {
  return gratitudes
    .filter(({ id }) => current ? id !== current.id : true)
    .sort((x, y) => Number(new Date(y.date)) - Number(new Date(x.date)));
};

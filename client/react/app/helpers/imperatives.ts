import { HttpResponse, get, post, put, del } from './http';

export enum ImperativeType {
  DO = 'DO',
  DONT = 'DONT'
}

export interface Imperative {
  id?: number;
  type?: ImperativeType;
  description: string;
}

export const fetchImperatives = (): Promise<Imperative[]> => {
  return get('/api/imperatives')
    .then((res: HttpResponse) => res.imperatives);
};

export const createImperative = (params: object): Promise<Imperative> => {
  return post('/api/imperatives', params)
    .then((res: HttpResponse) => res.imperative);
};

export const updateImperative = (id: number, params: object): Promise<Imperative> => {
  return put(`/api/imperatives/${id}`, params)
    .then((res: HttpResponse) => res.imperative);
};

export const deleteImperative = (id: number): Promise<Imperative> => {
  return del(`/api/imperatives/${id}`)
    .then((res: HttpResponse) => res.imperative);
};

import { HttpResponse, get, post, del } from './http';

export interface IUser {
  id: number;
  email: string;
  username: string;
}

export const signup = (params: object): Promise<IUser> => {
  return post('/api/signup', params)
    .then((res: HttpResponse) => res.user);
};

export const login = (credentials: object): Promise<IUser> => {
  return post('/api/login', credentials)
    .then((res: HttpResponse) => res.user);
};

export const isAuthenticated = (): Promise<boolean> => {
  return get('/api/is-authenticated')
    .then((res: HttpResponse) => res.isAuthenticated);
};

// TODO: this is a bit of a temporary hack
export const fetchCurrentUser = (): Promise<IUser> => {
  return get('/api/is-authenticated')
    .then((res: HttpResponse) => res.currentUser || null);
};

export const logout = (): Promise<HttpResponse> => {
  return del('/api/logout');
};

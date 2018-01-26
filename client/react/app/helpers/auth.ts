import { HttpResponse, get, post, del } from './http';

export interface User {
  id: number;
  email: string;
  username: string;
}

export const signup = (params: object): Promise<User> => {
  return post('/api/signup', params)
    .then((res: HttpResponse) => res.user);
};

export const login = (credentials: object): Promise<User> => {
  return post('/api/login', credentials)
    .then((res: HttpResponse) => res.user);
};

export const isAuthenticated = (): Promise<boolean> => {
  return get('/api/is-authenticated')
    .then((res: HttpResponse) => res.isAuthenticated);
};

export const logout = (): Promise<HttpResponse> => {
  return del('/api/logout');
};

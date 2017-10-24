import { HttpResponse, post, del } from './http';

export interface User {
  id: number;
  email: string;
  username: string;
}

export const login = (credentials: object): Promise<User> => {
  return post('/api/login', credentials)
    .then((res: HttpResponse) => res.user);
};

export const logout = (): Promise<HttpResponse> => {
  return del('/api/logout');
};

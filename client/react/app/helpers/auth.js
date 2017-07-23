import { post } from './http';

export const login = (credentials) => {
  return post('/api/login', credentials)
    .then(res => res.user);
};

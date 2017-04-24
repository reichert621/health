import { post } from './http';

export const login = () => {
  // Hard-coded for testing
  const credentials = {
    username: 'alex',
    password: 'password',
  };

  return post('/api/login', credentials);
};

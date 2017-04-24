import { get } from './http';
import { login } from './auth';

export const fetchEntries = () => {
  // Calling login manually here until a
  // login form is created for the React app
  return login()
    .then(() => get('/api/entries'))
    .then(res => res.entries);
};

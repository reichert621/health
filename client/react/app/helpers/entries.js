import { get, post } from './http';
import { login } from './auth';

export const fetchEntries = () => {
  // Calling login manually here until a
  // login form is created for the React app
  return login()
    .then(() => get('/api/entries'))
    .then(res => res.entries);
};

export const fetchEntry = (id) => {
  return get(`/api/entries/${id}`)
    .then(res => res.entry);
};

export const createEntry = (params) => {
  return post(`/api/entries`, params)
    .then(res => res.entry);
};

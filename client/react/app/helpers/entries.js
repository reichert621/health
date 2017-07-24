import { get, post, put, del } from './http';
import { login } from './auth';

export const fetchEntries = () => {
  return get('/api/entries')
    .then(res => res.entries);
};

export const fetchUserEntries = (username) => {
  return get(`/api/users/${username}/entries`)
    .then(res => res.entries);
};

export const fetchEntry = (id) => {
  return get(`/api/entries/${id}`)
    .then(res => res.entry);
};

export const createEntry = (params) => {
  return post('/api/entries', params)
    .then(res => res.entry);
};

export const updateEntry = (id, params) => {
  return put(`/api/entries/${id}`, params)
    .then(res => res.entry);
};

export const deleteEntry = (id) => {
  return del(`/api/entries/${id}`)
    .then(res => res.entry);
};

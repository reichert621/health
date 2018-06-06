import { Dispatch } from 'redux';
import { extend } from 'lodash';
import { IAction } from './index';
import { MappedItems, keyifyDate } from '../helpers/utils';
import {
  Entry,
  fetchEntries,
  fetchEntry,
  findOrCreateByDate as findOrCreateEntry
} from '../helpers/entries';

export const REQUEST_ENTRIES = 'REQUEST_ENTRIES';
export const RECEIVE_ENTRIES = 'RECEIVE_ENTRIES';
export const REQUEST_ENTRY = 'REQUEST_ENTRY';
export const RECEIVE_ENTRY = 'RECEIVE_ENTRY';

export const getEntries = () => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: REQUEST_ENTRIES });

    return fetchEntries()
      .then(entries => {
        return dispatch({
          type: RECEIVE_ENTRIES,
          payload: entries
        });
      });
  };
};

export const getEntry = (id: number) => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: REQUEST_ENTRY });

    return fetchEntry(id)
      .then(entry => {
        return dispatch({
          type: RECEIVE_ENTRY,
          payload: entry
        });
      });
  };
};

export const getEntryByDate = (date: string) => {
  return (dispatch: Dispatch<IAction>) => {
    dispatch({ type: REQUEST_ENTRY });

    return findOrCreateEntry(date)
      .then(entry => {
        return dispatch({
          type: RECEIVE_ENTRY,
          payload: entry
        });
      });
  };
};

// TODO: clean/DRY up
const updateWithEntry = (state = {
  items: [],
  byDate: {},
  byId: {}
} as MappedItems<Entry>, entry: Entry) => {
  const { byId, byDate, items } = state;
  const { id: entryId, date } = entry;
  const existing = byId[entryId];
  const updated = extend({}, existing, entry);

  return {
    items: existing ? items : items.concat(entryId),
    byDate: extend({}, byDate, {
      [keyifyDate(date)]: updated
    }),
    byId: extend({}, byId, {
      [entryId]: updated
    })
  };
};

const updateEntries = (state = {
  items: [],
  byDate: {},
  byId: {}
} as MappedItems<Entry>, entries: Entry[]) => {
  const { byId, byDate, items } = state;

  return entries.reduce((nextState, entry) => {
    return updateWithEntry(nextState, entry);
  }, { items, byId, byDate });
};

const entries = (state = {
  items: [],
  byDate: {},
  byId: {}
} as MappedItems<Entry>, action = {} as IAction) => {
  const { items, byDate, byId } = state;
  const { type, payload } = action;

  switch (type) {
    case RECEIVE_ENTRIES:
      return updateEntries(state, payload);
    case RECEIVE_ENTRY:
      return updateWithEntry(state, payload);
    default:
      return state;
  }
};

export default entries;

import * as moment from 'moment';
import { has, extend, times } from 'lodash';

export interface DatedItem {
  date?: moment.Moment|Date|string;
}

export const formatPoints = (points: number = 0): string => {
  const label = points === 1 ? 'point' : 'points';

  return `${points} ${label}`;
};

export const keyifyDate = (date: moment.Moment|Date|string): string => {
  return moment(date).format('MMDDYYYY');
};

export const mapByDate = (list: DatedItem[] = []): object => {
  return list.reduce((map, item) => {
    if (!has(item, 'date')) return map;

    const { date } = item;
    const key = keyifyDate(date);

    return extend(map, { [key]: item });
  }, {});
};

export const getPastDates = (days: number = 10): moment.Moment[] => {
  return times(days).map(n => {
    const formatted = moment().subtract(n, 'days').format('YYYY-MM-DD');

    return moment(formatted);
  });
};

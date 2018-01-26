import * as moment from 'moment';
import { has, extend, times, first, isNumber } from 'lodash';
import { User } from './auth';
import { IChecklist } from './checklist';
import { IScorecard } from './scorecard';
import { ReportingStats } from './reporting';

export interface AppState {
  currentUser?: User;
  currentView: string;
  checklists: {
    items: IChecklist[],
    byDate: {
      [date: string]: IChecklist[];
    }
  };
  scorecards: {
    items: IScorecard[],
    byDate: {
      [date: string]: IScorecard[];
    }
  };
  selected: {
    date?: moment.Moment;
    checklist: IChecklist;
    scorecard: IScorecard;
  };
  stats: ReportingStats;
}

export interface DatedItem {
  date?: moment.Moment|Date|string;
}

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

export const pluralize = (str: string, n?: number, customPlural?: string): string => {
  const simplePlural = `${str}s`;

  if (!str) return str;
  if (!n) return simplePlural;

  if (n === 1) {
    return str;
  } else {
    return (customPlural && customPlural.length) ? customPlural : simplePlural;
  }
};

export const calculateAverage = (nums: number[] = []): number => {
  if (!nums || !nums.length) return 0;

  const sum = nums.reduce((total, n) => total + n, 0);
  const count = nums.length;

  return sum / count;
};

export const getPercentage = (n: number, total: number): number => {
  const decimal = n / total;

  return decimal * 100;
};

export const getFormattedPercentage = (n: number, total: number): string => {
  const percentage = getPercentage(n, total);

  return percentage.toFixed(1);
};

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

export const getStreakStats = (stats: DatedItem[]): number[] => {
  if (!stats || !stats.length) return [];

  return stats
    .map(({ date }) => {
      return moment().diff(date, 'days');
    })
    .reduce((streaks, current, index, list) => {
      const prev = list[index - 1];

      if (isNumber(prev) && current === prev + 1) {
        streaks[streaks.length - 1] += 1;
      } else {
        streaks[streaks.length] = 1;
      }

      return streaks;
    }, []);
};

import * as Bluebird from 'bluebird';
import { keys, groupBy } from 'lodash';
import { HttpResponse, get } from './http';
import { fetchScorecard } from './scorecard';
import { DatedItem, getStreakStats } from './utils';

export interface ScoreByDay {
  [key: string]: number[];
}

export interface ReportingTask {
  task: string;
  count: number;
  points: number;
}

// TODO: name this better
export interface ReportingDatedItem extends DatedItem {
  count: number;
}

export interface ReportingStats {
  checklist: number[][];
  scorecard: number[][];
  completedChecklists: ReportingDatedItem[];
  completedScorecards: ReportingDatedItem[];
  checklistScoresByDay: ScoreByDay;
  scorecardScoresByDay: ScoreByDay;
  topTasks: ReportingTask[];
  totalScoreOverTime: number[][];
}

// TODO: unit test
export const getTotalStreak = (
  checklists: ReportingDatedItem[],
  scorecards: ReportingDatedItem[]
): number[] => {
  const all = checklists.concat(scorecards);
  const grouped = groupBy(all, 'date');
  const items = keys(grouped)
    .filter(date => grouped[date].length === 2)
    .map(date => ({ date }));

  return getStreakStats(items);
};

// TODO: unit test
export const calculateEarnings = (streaks: number[]): number => {
  const DAILY_EARNINGS = 10;
  const WEEKLY_EARNINGS = 30;
  const MONTHLY_EARNINGS = 200;
  const THREE_MONTH_BONUS = 400;
  const SIX_MONTH_BONUS = 800;
  const MAX_PER_YEAR = 100 * 100;

  return streaks.reduce((earnings, count) => {
    const n = count % 365;
    const days = n * DAILY_EARNINGS;
    const weeks = Math.floor(n / 7) * WEEKLY_EARNINGS;
    const months = Math.floor(n / 30) * MONTHLY_EARNINGS;
    const threeMonthBonus = n >= (3 * 30) ? THREE_MONTH_BONUS : 0;
    const sixMonthBonus = n >= (6 * 30) ? SIX_MONTH_BONUS : 0;
    const yearBonus = count >= 365 ? MAX_PER_YEAR : 0;
    const base = days + weeks + months;
    const bonuses = threeMonthBonus + sixMonthBonus + yearBonus;

    return earnings + base + bonuses;
  }, 0);
};

export const fetchChecklistStats = (): Promise<number[][]> => {
  return get(`/api/stats/checklists`)
    .then((res: HttpResponse) => res.stats);
};

export const fetchScorecardStats = (): Promise<number[][]> => {
  return get(`/api/stats/scorecards`)
    .then((res: HttpResponse) => res.stats);
};

export const fetchTopTasks = (): Promise<any[]> => {
  return get('/api/stats/top-tasks')
    .then((res: HttpResponse) => res.stats);
};

export const fetchCompletedChecklists = (): Promise<any[]> => {
  return get('/api/stats/completed-checklists')
    .then((res: HttpResponse) => res.stats);
};

export const fetchCompletedScorecards = (): Promise<any[]> => {
  return get('/api/stats/completed-scorecards')
    .then((res: HttpResponse) => res.stats);
};

export const fetchChecklistScoresByDay = (): Promise<any[]> => {
  return get('/api/stats/checklist-scores-by-day')
    .then((res: HttpResponse) => res.stats);
};

export const fetchScorecardScoresByDay = (): Promise<any[]> => {
  return get('/api/stats/scorecard-scores-by-day')
    .then((res: HttpResponse) => res.stats);
};

export const fetchDepressionLevelFrequency = (): Promise<any[]> => {
  return get('/api/stats/depression-level-frequency')
    .then((res: HttpResponse) => res.stats);
};

export const fetchTotalScoreOverTime = (): Promise<any[]> => {
  return get('/api/stats/total-score-over-time')
    .then((res: HttpResponse) => res.stats);
};

export const fetchAllStats = (): Promise<ReportingStats> => {
  return get('/api/stats/all')
    .then((res: HttpResponse) => res.stats)
    .then(stats => {
      const { checklistStats, scorecardStats } = stats;

      return {
        checklist: checklistStats, // aliases
        scorecard: scorecardStats,
        ...stats
      };
    });
};

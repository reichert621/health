import { HttpResponse, get } from './http';
import * as Bluebird from 'bluebird';
import { fetchScorecard } from './scorecard';
import { DatedItem } from './utils';

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

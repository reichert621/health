import { HttpResponse, get } from './http';
import * as Bluebird from 'bluebird';

export interface ReportingStats {
  checklist: number[][];
  scorecard: number[][];
}

// TODO: returns object or array?
export const fetchChecklistStats = (): Promise<number[][]> => {
  return get(`/api/stats/checklists`)
    .then((res: HttpResponse) => res.stats);
};

// TODO: returns object or array?
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

export const fetchStats = (): Bluebird<ReportingStats> => {
  return Bluebird.all([
    fetchChecklistStats(),
    fetchScorecardStats(),
    fetchCompletedChecklists(),
    fetchCompletedScorecards(),
    fetchTopTasks()
  ])
    .then(([
      checklistStats,
      scorecardStats,
      completedChecklists,
      completedScorecards,
      taskStats
    ]) => {
      return {
        completedChecklists,
        completedScorecards,
        checklist: checklistStats,
        scorecard: scorecardStats,
        topTasks: taskStats
      };
    });
};

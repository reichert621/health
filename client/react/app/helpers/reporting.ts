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

export const fetchStats = (): Bluebird<ReportingStats> => {
  return Bluebird.all([
    fetchChecklistStats(),
    fetchScorecardStats()
  ])
    .then(([checklistStats, scorecardStats]) => {
      return {
        checklist: checklistStats,
        scorecard: scorecardStats
      };
    });
};

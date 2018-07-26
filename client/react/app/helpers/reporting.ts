import * as Bluebird from 'bluebird';
import * as moment from 'moment';
import { keys, groupBy, extend, uniq, isNumber } from 'lodash';
import { HttpResponse, get } from './http';
import { DatedItem, getStreakStats, calculateAverage } from './utils';

export interface ScoreByDay {
  [key: string]: number[];
}

export interface TaskStat {
  task: string;
}

export interface TaskStatMap<T> {
  [task: string]: T;
}

export interface ReportingTask extends TaskStat {
  count: number;
  points: number;
  taskId?: number;
  depression?: number;
  anxiety?: number;
  wellness?: number;
  happiness?: number;
  category?: string;
  description?: string;
}

// TODO: name this better
export interface ReportingDatedItem extends DatedItem {
  count: number;
}

export interface ChecklistQuestionStats {
  question: string;
  scores: number[];
  count: number;
  total: number;
  average: number;
}

export interface TaskImpactStats extends TaskStat {
  data: {
    average: number;
    scores?: number[];
    dates?: moment.Moment | Date | string[]
  };
}

export interface AbilityStats {
  [ability: string]: {
    count: number;
    score: number;
  };
}

export interface DateRange {
  [key: string]: string;
  startDate?: string;
  endDate?: string;
}

export interface ReportingStats {
  checklist: number[][];
  checklistStats: number[][];
  scorecard: number[][];
  scorecardStats: number[][];
  assessmentStats: { [type: string]: number[][]; };
  completedChecklists: ReportingDatedItem[];
  completedScorecards: ReportingDatedItem[];
  checklistScoresByDay: ScoreByDay;
  scorecardScoresByDay: ScoreByDay;
  topTasks: ReportingTask[];
  totalScoreOverTime: number[][];
  checklistQuestionStats: ChecklistQuestionStats[];
  checklistScoresByTask: TaskImpactStats[];
  taskAbilityStats: AbilityStats;
  weekStats: any; // FIXME
  // Assessments - Depression
  completedDepressionAssessments: ReportingDatedItem[];
  depressionScoresByDay: ScoreByDay;
  depressionLevelFrequency: {
    [level: string]: number;
  };
  depressionQuestionStats: ChecklistQuestionStats[];
  depressionScoresByTask: TaskImpactStats[];
  // Assessments - Anxiety
  completedAnxietyAssessments: ReportingDatedItem[];
  anxietyScoresByDay: ScoreByDay;
  anxietyLevelFrequency: {
    [level: string]: number;
  };
  anxietyQuestionStats: ChecklistQuestionStats[];
  anxietyScoresByTask: TaskImpactStats[];
  // Assessments - Wellness
  completedWellnessAssessments: ReportingDatedItem[];
  wellnessScoresByDay: ScoreByDay;
  wellnessLevelFrequency: {
    [level: string]: number;
  };
  wellnessQuestionStats: ChecklistQuestionStats[];
  wellnessScoresByTask: TaskImpactStats[];
}

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

export const calculateEarnings = (streaks: number[]): number => {
  // Values are in cents (USD)
  const DAILY_EARNINGS = 100;
  const WEEKLY_EARNINGS = 300;
  const MONTHLY_EARNINGS = 2000;
  const THREE_MONTH_BONUS = 4000;
  const SIX_MONTH_BONUS = 8000;
  const MAX_PER_YEAR = 1000 * 100;

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

const groupByTask = (map: TaskStatMap<TaskStat>, stat: TaskStat) => {
  return extend(map, { [stat.task]: stat });
};

const mapTasksToScores = (
  stats: TaskImpactStats[]
): TaskStatMap<TaskImpactStats> => {
  return stats.reduce(groupByTask, {});
};

const mapTasksByName = (stats: ReportingTask[]): TaskStatMap<ReportingTask> => {
  return stats.reduce(groupByTask, {});
};

// TODO: this is a temporary hack, should probably be handled in API
const normalizeWellnessScore = (score: number) => {
  return (score / 80) * 100;
};

// TODO: should each field be required?
const calculateHappiness = ({ depression, anxiety, wellness }: {
  depression?: number,
  anxiety?: number,
  wellness?: number
}) => {
  const scores = [
    isNumber(depression) ? (100 - depression) : null,
    isNumber(anxiety) ? (100 - anxiety) : null,
    isNumber(wellness) ? wellness : null
  ].filter(isNumber);

  return calculateAverage(scores);
};

// TODO: clean this up
const extractAverageField = (stats?: TaskImpactStats) => {
  if (!stats || !stats.data) return null;

  const average = stats.data && stats.data.average;

  return isNumber(average) ? average : null;
};

// TODO: clean this up
export const mergeTaskStats = (topTasks: ReportingTask[], {
  depressionScoresByTask,
  anxietyScoresByTask,
  wellnessScoresByTask
}: {
  depressionScoresByTask: TaskImpactStats[],
  anxietyScoresByTask: TaskImpactStats[],
  wellnessScoresByTask: TaskImpactStats[]
}): ReportingTask[] => {
  const t = mapTasksByName(topTasks);
  const d = mapTasksToScores(depressionScoresByTask);
  const a = mapTasksToScores(anxietyScoresByTask);
  const w = mapTasksToScores(wellnessScoresByTask);
  const tasks = uniq(
    keys(t).concat(keys(d)).concat(keys(a)).concat(keys(w))
  );

  return tasks.map(task => {
    const { taskId, count, points, category, description } = t[task];
    const averageDepressionScore = extractAverageField(d[task]);
    const averageAnxietyScore = extractAverageField(a[task]);
    const averageWellnessScore = extractAverageField(w[task]);
    // TODO: clean this up
    const normalizedWellnessScore = isNumber(averageWellnessScore)
      ? normalizeWellnessScore(averageWellnessScore)
      : null;

    return {
      task,
      taskId,
      count,
      category,
      description,
      points: count * points,
      depression: averageDepressionScore,
      anxiety: averageAnxietyScore,
      wellness: normalizedWellnessScore,
      happiness: calculateHappiness({
        depression: averageDepressionScore,
        anxiety: averageAnxietyScore,
        wellness: normalizedWellnessScore
      })
    };
  });
};

export const fetchChecklistStats = (): Promise<number[][]> => {
  return get(`/api/stats/checklists`)
    .then((res: HttpResponse) => res.stats);
};

export const fetchAssessmentStats = (): Promise<
  { [key: string]: number[][] }
> => {
  return get(`/api/stats/assessments`)
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

export const fetchTaskCategoryStats = (): Promise<any[]> => {
  return get('/api/stats/categories')
    .then((res: HttpResponse) => res.stats);
};

export const fetchChecklistQuestionStats = (): Promise<any[]> => {
  return get('/api/stats/questions')
    .then((res: HttpResponse) => res.stats);
};

export const fetchTaskStats = (): Bluebird<
  [any[], number[][], { [key: string]: number[][] }]
> => {
  return Bluebird.all([
    fetchTaskCategoryStats(),
    fetchChecklistStats(),
    fetchAssessmentStats()
  ]);
};

export const fetchMoodStats = (): Bluebird<[any[], number[][]]> => {
  return Bluebird.all([
    fetchChecklistQuestionStats(),
    fetchScorecardStats()
  ]);
};

export const fetchWeekStats = (date: string): Promise<any> => {
  return get(`/api/stats/week/${date}`)
    .then((res: HttpResponse) => res.stats);
};

export const fetchAllStats = (range = {} as DateRange): Promise<ReportingStats> => {
  const qs = Object.keys(range)
    .filter(key => range[key])
    .map(key => `${key}=${range[key]}`)
    .join('&');

  return get(`/api/stats/all?${qs}`)
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

import { HttpResponse, get, post, put } from './http';
import { IDropdownOption } from './utils';
import { IAssessmentStats } from './assessment';
import {
  DateRange,
  normalizeWellnessScore,
  calculateHappiness
} from './reporting';

export interface Task {
  id?: number;
  userId?: number;
  categoryId?: number;
  description: string;
  category?: string;
  points: number;
  isActive?: boolean;
  isFavorite?: boolean;
  isComplete?: boolean;
}

export interface NewTask {
  description: string;
  category: string;
  points: number;
  isComplete?: boolean;
}

export interface PointOption extends IDropdownOption {
  points: number;
}

export interface TaskAssessmentStats {
  task: Task;
  count: number;
  stats: IAssessmentStats;
}

export const getPointOptions = (): PointOption[] => {
  return [
    { value: '1 point', subvalue: 'Very Easy', points: 1 },
    { value: '2 points', subvalue: 'Easy', points: 2 },
    { value: '4 points', subvalue: 'Medium', points: 4 },
    { value: '8 points', subvalue: 'Difficult', points: 8 },
    { value: '16 points', subvalue: 'Very Difficult', points: 16 },
    { value: '24 points', subvalue: 'Extremely Difficult', points: 24 },
    { value: '-1 points', subvalue: 'Avoid', points: -1 },
    { value: '-4 points', subvalue: 'Strongly Avoid', points: -4 }
  ];
};

export const fetchTasks = (): Promise<Task[]> => {
  return get('/api/tasks').then((res: HttpResponse) => res.tasks);
};

export const fetchTopTasks = (): Promise<any[]> => {
  return get('/api/stats/top-tasks').then((res: HttpResponse) => res.stats);
};

export const fetchTaskSuggestions = (): Promise<any> => {
  return get('/api/tasks/suggestions').then(
    (res: HttpResponse) => res.suggestions
  );
};

export const fetchDefaultTasks = (): Promise<NewTask[]> => {
  return get('/api/tasks/defaults').then((res: HttpResponse) => res.tasks);
};

export const createSuggestedTask = (suggestion: NewTask): Promise<Task> => {
  const { category, description, points } = suggestion;

  return post('/api/tasks/suggestions', { category, description, points }).then(
    (res: HttpResponse) => res.task
  );
};

export const createTask = (params: object): Promise<Task> => {
  return post('/api/tasks', params).then((res: HttpResponse) => res.task);
};

export const updateTask = (id: number, params: object): Promise<Task> => {
  return put(`/api/tasks/${id}`, params).then((res: HttpResponse) => res.task);
};

export const fetchStats = (
  range = {} as DateRange
): Promise<TaskAssessmentStats[]> => {
  const qs = Object.keys(range)
    .filter(key => range[key])
    .map(key => `${key}=${range[key]}`)
    .join('&');

  return get(`/api/stats/tasks?${qs}`).then((res: HttpResponse) => res.result);
};

export const fetchStatsById = (id: number) => {
  return get(`/api/tasks/${id}/stats`).then(res => res.result);
};

export interface Category {
  id: number;
  userId: number;
  name: string;
}

export const fetchCategories = (): Promise<Category[]> => {
  return get('/api/categories').then((res: HttpResponse) => res.categories);
};

export const createCategory = (params: object): Promise<Category> => {
  return post('/api/categories', params).then(
    (res: HttpResponse) => res.category
  );
};

export const calculateScore = (tasks: Task[]): number => {
  return tasks.reduce((score, task) => {
    const { isComplete, points } = task;

    return isComplete ? score + points : score;
  }, 0);
};

export const formatTaskStats = (stats: TaskAssessmentStats[]) => {
  return stats.map(stat => {
    const { task, count, stats } = stat;
    const { description, category } = task;
    const name = `${category}: ${description}`;
    const { depression, anxiety, wellbeing } = stats;
    const {
      included: dIncluded,
      excluded: dExcluded,
      delta: dDelta
    } = depression;
    const { included: aIncluded, excluded: aExcluded, delta: aDelta } = anxiety;
    const {
      included: _wIncluded,
      excluded: _wExcluded,
      delta: _wDelta
    } = wellbeing;
    const wIncluded = normalizeWellnessScore(_wIncluded);
    const wExcluded = normalizeWellnessScore(_wExcluded);
    const wDelta = normalizeWellnessScore(_wDelta);

    const happiness = calculateHappiness({
      depression: dIncluded,
      anxiety: aIncluded,
      wellness: wIncluded
    });

    const exHappiness = calculateHappiness({
      depression: dExcluded,
      anxiety: aExcluded,
      wellness: wExcluded
    });

    const hDelta = happiness - exHappiness;

    return {
      name,
      count,
      percentages: {
        happiness,
        depression: dIncluded,
        anxiety: aIncluded,
        wellness: wIncluded
      },
      deltas: {
        depression: dDelta,
        anxiety: aDelta,
        wellness: wDelta,
        happiness: hDelta
      }
    };
  });
};

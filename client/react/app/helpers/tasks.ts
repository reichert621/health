import { HttpResponse, get, post, put } from './http';
import { IDropdownOption } from './utils';

export interface Task {
  id: number;
  userId: number;
  categoryId: number;
  description: string;
  points: number;
  isActive: boolean;
  isComplete: boolean;
}

export interface PointOption extends IDropdownOption {
  points: number;
}

export const getPointOptions = (): PointOption[] => {
  return [
    { value: '1 point', subvalue: 'Very Easy', points: 1 },
    { value: '2 points', subvalue: 'Easy', points: 2 },
    { value: '4 points', subvalue: 'Medium', points: 4 },
    { value: '8 points', subvalue: 'Difficult', points: 8 },
    { value: '16 points', subvalue: 'Very Difficult', points: 16 }
  ];
};

export const fetchTasks = (): Promise<Task[]> => {
  return get('/api/tasks')
    .then((res: HttpResponse) => res.tasks);
};

export const fetchTopTasks = (): Promise<any[]> => {
  return get('/api/stats/top-tasks')
    .then((res: HttpResponse) => res.stats);
};

export const createTask = (params: object): Promise<Task> => {
  return post('/api/tasks', params)
    .then((res: HttpResponse) => res.task);
};

export const updateTask = (id: number, params: object): Promise<Task> => {
  return put(`/api/tasks/${id}`, params)
    .then((res: HttpResponse) => res.task);
};

export interface Category {
  id: number;
  userId: number;
  name: string;
}

export const fetchCategories = (): Promise<Category[]> => {
  return get('/api/categories')
    .then((res: HttpResponse) => res.categories);
};

export const createCategory = (params: object): Promise<Category> => {
  return post('/api/categories', params)
    .then((res: HttpResponse) => res.category);
};

export const calculateScore = (tasks: Task[]): number => {
  return tasks.reduce((score, task) => {
    const { isComplete, points } = task;

    return isComplete ? (score + points) : score;
  }, 0);
};

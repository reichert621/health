import { HttpResponse, get, post, put } from './http';

export interface Task {
  id: number;
  userId: number;
  categoryId: number;
  description: string;
  points: number;
  isActive: boolean;
  isComplete: boolean;
}

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

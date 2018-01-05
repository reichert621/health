import { HttpResponse, get, post } from './http';

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

export const createTask = (params: object): Promise<Task> => {
  return post('/api/tasks', params)
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

export const createCategory = (params: object): Promise<Task> => {
  return post('/api/categories', params)
    .then((res: HttpResponse) => res.category);
};

export const calculateScore = (tasks: Task[]): number => {
  return tasks.reduce((score, task) => {
    const { isComplete, points } = task;

    return isComplete ? (score + points) : score;
  }, 0);
};

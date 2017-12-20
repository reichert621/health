import { HttpResponse, get } from './http';

export interface Task {
  id: number;
  userId: number;
  categoryId: number;
  description: string;
  points: number;
  isActive: boolean;
}

export const fetchTasks = (): Promise<Task[]> => {
  return get('/api/tasks')
    .then((res: HttpResponse) => res.tasks);
};

import { HttpResponse, get } from './http';

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

export const calculateScore = (tasks: Task[]): number => {
  return tasks.reduce((score, task) => {
    const { isComplete, points } = task;

    return isComplete ? (score + points) : score;
  }, 0);
};

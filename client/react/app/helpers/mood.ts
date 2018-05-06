import { HttpResponse, get, post, put, del } from './http';

export enum MoodCode {
  VERY_UNHAPPY = 'very_unhappy',
  UNHAPPY = 'unhappy',
  NEUTRAL = 'neutral',
  HAPPY = 'happy',
  VERY_HAPPY = 'very_happy'
}

export interface IMood {
  id: number;
  date?: string;
  description: string;
  code: MoodCode;
}

export const fetchMoodOptions = (): Promise<IMood[]> => {
  return get('/api/moods')
    .then((res: HttpResponse) => res.moods);
};

export const fetchUserMoods = (): Promise<IMood[]> => {
  return get('/api/moods/user')
    .then((res: HttpResponse) => res.moods);
};

export const findMoodByDate = (date: string): Promise<IMood> => {
  return get(`/api/moods/date/${date}`)
    .then((res: HttpResponse) => res.mood);
};

export const setMoodByDate = (date: string, moodId: number): Promise<any> => {
  return post('/api/moods/date', { date, moodId })
    .then((res: HttpResponse) => res.mood);
};



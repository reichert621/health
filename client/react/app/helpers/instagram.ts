import { HttpResponse, get } from './http';

export interface InstagramImage {
  images: {
    standard_resolution: {
      url: string;
    };
  };
}

export const authenticate = (): Promise<any> => {
  return get('/api/auth/instagram')
    .then((res: HttpResponse) => res);
};

export const fetchAuthUrl = (): Promise<string> => {
  return get('/api/instagram/auth-url')
    .then((res: HttpResponse) => res.url);
};

export const fetchToken = (): Promise<string|null> => {
  return get('/api/instagram/token')
    .then((res: HttpResponse) => res.token);
};

export const fetchRecentImages = (): Promise<any[]> => {
  return get('/api/instagram/media')
    .then((res: HttpResponse) => res.result);
};

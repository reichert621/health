import { assign } from 'lodash';

interface HttpConfig {
  credentials: string;
  method: string;
  headers: object;
  body?: string;
}

export interface HttpResponse {
  status: number;
  error?: any;
  [propName: string]: any;
}

export const GET: string = 'GET';
export const POST: string = 'POST';
export const PUT: string = 'PUT';
export const DELETE: string = 'DELETE';

/**
 * Construct the HTTP config object
 */
const getHttpConfig = (options = {}): HttpConfig => {
  return assign({
    credentials: 'same-origin',
    method: GET,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  }, options);
};

/**
 * Check the response if the user has authorization
 */
const isAuthorized = (res: any): HttpResponse => {
  if (res.status === 401) {
    throw new Error('Not authorized!');
  }

  return res.json();
};

/**
 * Check if the HTTP response has an error
 */
const validate = (res: HttpResponse): HttpResponse => {
  if (res.error || res.status >= 400) {
    throw new Error(res.error || res.status);
  }

  return res;
};

/**
 * Request and validate the provided API endpoint
 */
const request = (endpoint: string, config: object): Promise<HttpResponse> =>
  fetch(endpoint, config)
    .then(isAuthorized)
    .then(validate);

/**
 * Make an HTTP GET request
 */
export const get = (endpoint: string): Promise<HttpResponse> => {
  const config = getHttpConfig();

  return request(endpoint, config);
};

/**
 * Make an HTTP POST request
 */
export const post = (endpoint: string, body: object = {}): Promise<HttpResponse> => {
  const config = getHttpConfig({
    method: POST,
    body: JSON.stringify(body)
  });

  return request(endpoint, config);
};

/**
 * Make an HTTP PUT request
 */
export const put = (endpoint: string, body: object): Promise<HttpResponse> => {
  const config = getHttpConfig({
    method: PUT,
    body: JSON.stringify(body)
  });

  return request(endpoint, config);
};

/**
 * Make an HTTP DELETE request
 */
export const del = (endpoint: string): Promise<HttpResponse> => {
  const config = getHttpConfig({
    method: DELETE
  });

  return request(endpoint, config);
};

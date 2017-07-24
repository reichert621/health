const getHttpConfig = (options = {}) => {
  return Object.assign({
    credentials: 'same-origin',
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  }, options);
};

const isAuthorized = (res) => {
  if (res.status === 401) {
    throw new Error('Not authorized!');
  }

  return res.json();
};

const validate = (res) => {
  if (res.error || res.status >= 400) {
    throw new Error(res.error || res.status);
  }

  return res;
};

const request = (endpoint, config) =>
  fetch(endpoint, config)
    .then(isAuthorized)
    .then(validate);

export const get = (endpoint) => {
  const config = getHttpConfig();

  return request(endpoint, config);
};

export const post = (endpoint, body) => {
  const config = getHttpConfig({
    method: 'POST',
    body: JSON.stringify(body)
  });

  return request(endpoint, config);
};


export const put = (endpoint, body) => {
  const config = getHttpConfig({
    method: 'PUT',
    body: JSON.stringify(body)
  });

  return request(endpoint, config);
};

export const del = (endpoint) => {
  const config = getHttpConfig({
    method: 'DELETE'
  });

  return request(endpoint, config);
};

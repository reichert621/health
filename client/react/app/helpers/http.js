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

export const get = (endpoint) => {
  const config = getHttpConfig();

  return fetch(endpoint, config)
    .then(res => res.json());
};

export const post = (endpoint, body) => {
  const config = getHttpConfig({
    method: 'POST',
    body: JSON.stringify(body)
  });

  return fetch(endpoint, config)
    .then(res => res.json());
};


export const put = (endpoint, body) => {
  const config = getHttpConfig({
    method: 'PUT',
    body: JSON.stringify(body)
  });

  return fetch(endpoint, config)
    .then(res => res.json());
};

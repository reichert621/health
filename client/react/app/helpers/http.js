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

const validateResponse = (res) => {
  if (res.status >= 400) {
    throw new Error('Bad response from server');
  }

  return res.json();
};

export const get = (endpoint) => {
  const config = getHttpConfig();

  return fetch(endpoint, config)
    .then(validateResponse);
};

export const post = (endpoint, body) => {
  const config = getHttpConfig({
    method: 'POST',
    body: JSON.stringify(body)
  });

  return fetch(endpoint, config)
    .then(validateResponse);
};


export const put = (endpoint, body) => {
  const config = getHttpConfig({
    method: 'PUT',
    body: JSON.stringify(body)
  });

  return fetch(endpoint, config)
    .then(validateResponse);
};

export const del = (endpoint) => {
  const config = getHttpConfig({
    method: 'DELETE'
  });

  return fetch(endpoint, config)
    .then(validateResponse);
};

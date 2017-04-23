function AuthService($http) {
  const prefix = '$blog$';
  const field = 'currentUser';
  const key = `${prefix}${field}`;
  const storage = sessionStorage || {};

  const isValidUser = (user) =>
    user.id && user.email && user.username;

  const setCurrentUserId = (userId) => {
    storage[key] = userId || '';
  };

  const getCurrentUserId = () => {
    const userId = storage[key];

    return userId ? userId : null;
  };

  return {
    setCurrentUserId,

    getCurrentUserId,

    login: (credentials) =>
      $http.post('/api/login', credentials)
        .then(res => res.data.user)
        .then(user => {
          setCurrentUserId(user.id);

          return user;
        }),

    logout: () =>
      $http.get('/api/logout')
  };
};

AuthService.$inject = ['$http'];

export default AuthService;

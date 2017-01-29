function AuthService($http) {
  return {
    login: (credentials) =>
      $http.post('/api/login', credentials)
        .then(res => res.data.user),

    logout: () =>
      $http.get('/api/logout')
  };
};

AuthService.$inject = ['$http'];

export default AuthService;

function AuthService($http) {
  return {
    login: (credentials) => {
      return $http.post('/api/login', credentials)
        .then(res => res.data.user);
    }
  };
};

AuthService.$inject = ['$http'];

export default AuthService;

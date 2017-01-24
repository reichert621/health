const config = ($stateProvider, $urlRouterProvider) => {
  $stateProvider
    .state('login', {
      url: '/login',
      template: '<login></login>'
    });

  $urlRouterProvider.otherwise('/login');
};

config.$inject = [
  '$stateProvider',
  '$urlRouterProvider'
];

export default config;

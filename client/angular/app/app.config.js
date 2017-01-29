const interceptor = ($log, $injector) => {
  return {
    request(config) {
      $log.info('http config!', config);

      return config;
    },

    responseError(err) {
      $log.error('http response error!', err);
      $injector.get('$state').go('login');

      return err;
    }
  }
};

interceptor.$inject = ['$log', '$injector'];

const config = ($locationProvider, $httpProvider) => {
  // @see: https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions
  // #how-to-configure-your-server-to-work-with-html5mode
  // $locationProvider.html5Mode(true).hashPrefix('!');

  $httpProvider.interceptors.push(interceptor);
};

config.$inject = ['$locationProvider', '$httpProvider'];

export default config;

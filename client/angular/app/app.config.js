const interceptor = ($log) => {
  return {
    request(config) {
      $log.info('http config!', config);

      return config;
    }
  }
};

interceptor.$inject = ['$log'];

const config = ($locationProvider, $httpProvider) => {
  // @see: https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions
  // #how-to-configure-your-server-to-work-with-html5mode
  // $locationProvider.html5Mode(true).hashPrefix('!');

  $httpProvider.interceptors.push(interceptor);
};

config.$inject = ['$locationProvider', '$httpProvider'];

export default config;

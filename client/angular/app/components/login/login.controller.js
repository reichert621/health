class LoginController {
  constructor($log, $state, AuthService) {
    this._log = $log;
    this._state = $state;
    this.Auth = AuthService;

    this.credentials = {};
  }

  $onInit() {}

  login(credentials) {
    const { Auth, _state, _log } = this;

    return Auth.login(credentials)
      .then(user => {
        if (user) {
          _state.go('blog');
        } else {
          _log.error('Invalid credentials!');
        }
      })
      .catch(err =>
        _log.error(err.data.error));
  }
}

LoginController.$inject = ['$log', '$state', 'AuthService'];

export default LoginController;

const ENTER = 'Enter';

const isEnterKey = (e) => e.key === ENTER;

class BlogController {
  constructor($log, $state, EntryService, AuthService) {
    this.log = $log;
    this.go = $state.go;
    this.Entry = EntryService;
    this.Auth = AuthService;

    this.name = 'Blog';
    this.entry = {};
    this.entries = [];
  }

  $onInit() {
    return this.fetch();
  }

  fetch() {
    const { Entry, log } = this;

    return Entry.list()
      .then(entries => {
        this.entries = entries;
      })
      .catch(log.error);
  }

  add(entry) {
    const { Entry, log } = this;

    return Entry.create(entry)
      .then(ent => {
        this.entry = {};
        this.entries = this.entries.concat(ent);
      })
      .catch(log.error);
  }

  remove(id) {
    const { Entry, log } = this;

    return Entry.delete(id)
      .then(entry => {
        this.entries = this.entries
          .filter(e => e.id !== id);
      })
      .catch(log.error);
  }

  logout() {
    const { Auth, go, log } = this;

    return Auth.logout()
      .then(() => go('login'))
      .catch(log.error);
  }
}

BlogController.$inject = [
  '$log',
  '$state',
  'EntryService',
  'AuthService'
];

export default BlogController;

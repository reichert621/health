const ENTER = 'Enter';

const isEnterKey = (e) => e.key === ENTER;

class BlogController {
  constructor($log, EntryService) {
    this._log = $log;
    this.EntryService = EntryService;

    this.name = 'Blog';
    this.entry = {};
    this.entries = [];
  }

  $onInit() {
    return this.fetch();
  }

  fetch() {
    const { EntryService, _log } = this;

    return EntryService.list()
      .then(entries => {
        this.entries = entries;
      })
      .catch(_log.error);
  }

  add(entry) {
    const { EntryService, _log } = this;

    return EntryService.create(entry)
      .then(ent => {
        this.entry = {};
        this.entries = this.entries.concat(ent);
      })
      .catch(_log.error);
  }

  remove(id) {
    const { EntryService, _log } = this;

    return EntryService.delete(id)
      .then(entry => {
        this.entries = this.entries
          .filter(e => e.id !== id);
      })
      .catch(_log.error);
  }
}

BlogController.$inject = ['$log', 'EntryService'];

export default BlogController;

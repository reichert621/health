const ENTER = 'Enter';

const isEnterKey = (e) => e.key === ENTER;

class BlogController {
  constructor($log, EntryService) {
    this._log = $log;
    this.EntryService = EntryService;
    this._id = 0;
    this.name = 'Blog';
    this.entry = '';
    this.entries = [];
  }

  $onInit() {
    const { EntryService, _log } = this;

    return EntryService.list()
      .then(entries => {
        this.entries = entries;
        this._id += entries.length;
      })
      .catch(_log.error);
  }

  add(content) {
    if (!content || !content.length) return;

    const _id = ++this._id;
    const message = { _id, content };

    this.entry = '';
    this.entries = this.entries
      .concat(message);
  }

  remove(_id) {
    this.entries = this.entries
      .filter(m => m._id !== _id);
  }

  handleKeydown(e) {
    if (isEnterKey(e)) {
      const text = this.entry;

      this.add(text);
    }
  }
}

BlogController.$inject = ['$log', 'EntryService'];

export default BlogController;

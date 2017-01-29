class CreateEntryController {
  constructor($log, EntryService) {
    this._log = $log;
    this.Entry = EntryService;
    this.entry = {};
  }

  $onInit() {}

  add(entry) {
    const { Entry, _log } = this;

    return Entry.create(entry)
      .then(ent => {
        this.entry = {};
        this.entries = this.entries.concat(ent);
      })
      .catch(_log.error);
  }
}

CreateEntryController.$inject = ['$log', 'EntryService'];

export default CreateEntryController;

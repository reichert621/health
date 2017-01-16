class CreateEntryController {
  constructor($log, EntryService) {
    this._log = $log;
    this.EntryService = EntryService;
    this.entry = {};
  }

  $onInit() {}

  add(entry) {
    const { EntryService, _log } = this;

    return EntryService.create(entry)
      .then(ent => {
        this.entry = {};
        this.entries = this.entries.concat(ent);
      })
      .catch(_log.error);
  }
}

CreateEntryController.$inject = ['$log', 'EntryService'];

export default CreateEntryController;

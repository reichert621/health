const ENTER = 'Enter';

const isEnterKey = (e) => e.key === ENTER;

class BlogController {
  constructor() {
    this._id = 0;
    this.name = 'Blog';
    this.message = '';
    this.messages = [];
  }

  add(content) {
    const _id = ++this._id;
    const message = { _id, content };

    this.message = '';
    this.messages = this.messages
      .concat(message);
  }

  remove(_id) {
    this.messages = this.messages
      .filter(m => m._id !== _id);
  }

  handleKeydown(e) {
    if (isEnterKey(e)) {
      const text = this.message;

      this.add(text);
    }
  }
}

export default BlogController;

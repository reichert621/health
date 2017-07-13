import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { fetchEntry, updateEntry, deleteEntry } from '../helpers/entries';

class EditEntry extends React.Component {
  constructor(props) {
    super(props);

    this.state = { id: null, title: '', content: '' };
  }

  componentDidMount() {
    const { match } = this.props;
    const { id } = match.params;

    return fetchEntry(id)
      .then(({ title, content }) =>
        this.setState({ id, title, content }));
  }

  handleInputChange({ target }) {
    // console.log(target.name, target.value);
    const { name, value } = target;

    this.setState({ [name]: value });
  }

  handleSave(e) {
    const { id, title, content } = this.state;
    const { history } = this.props;

    if (!title) {
      return console.log('Title is required!');
    }

    if (!content) {
      return console.log('Content is required!');
    }

    return updateEntry(id, { title, content })
      .then(entry =>
        history.push(`/entry/${entry.id}`));
  }

  handleDelete(e) {
    const confirmed = confirm('Are you sure?');

    if (!confirmed) return console.log('Dismissed!');

    const { id } = this.state;
    const { history } = this.props;

    return deleteEntry(id)
      .then(() => history.push('/'));
  }

  render() {
    const entry = this.state;

    return (
      <div className="new-entry-container">
        <div>
          <Link to={`/entry/${entry.id}`}>Back</Link>
        </div>

        <h1 className="entry-title">
          Edit Entry
        </h1>

        <input
          type="text"
          name="title"
          className="new-entry-title"
          placeholder="Title"
          value={entry.title}
          onChange={this.handleInputChange.bind(this)} />

        <textarea
          rows="8"
          name="content"
          className="new-entry-content"
          placeholder="Content..."
          value={entry.content}
          onChange={this.handleInputChange.bind(this)}>
        </textarea>

        <button
          className="new-entry-submit"
          onClick={this.handleSave.bind(this)}>
          Save
        </button>

        <button
          className="new-entry-submit"
          onClick={this.handleDelete.bind(this)}>
          Delete
        </button>
      </div>
    );
  }
}

export default EditEntry;

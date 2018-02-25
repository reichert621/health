import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import * as moment from 'moment';
import NavBar from '../navbar';
import { fetchEntry, updateEntry } from '../../helpers/entries';
import md from '../../helpers/markdown';
import './Entry.less';

const formatHTML = (content = '') => {
  return { __html: md(content) };
};

const EntryPrompts = () => {
  const styles = {
    container: { marginBottom: 16 },
    title: { marginBottom: 8 }
  };

  return (
    <div style={styles.container}>
      <div className='text-active' style={styles.title}>
        Prompts
      </div>

      <div>What did you do today?</div>
      <div>What are your goals for tomorrow?</div>
      <div>What have you been thinking about lately?</div>
      <div>What are 3 things you're grateful for?</div>
      <div>What did you learn today?</div>
    </div>
  );
};

interface EntryProps extends RouteComponentProps<{ id: number }> {
  // TODO
}

interface EntryState {
  date: moment.Moment;
  entry: any;
  isEditing: boolean;
  isSaving: boolean;
}

class EntryContainer extends React.Component<EntryProps, EntryState> {
  constructor(props: EntryProps) {
    super(props);

    this.state = {
      date: moment(),
      entry: {},
      isEditing: false,
      isSaving: false
    };
  }

  componentDidMount() {
    const { match, history } = this.props;
    const { id } = match.params;

    return fetchEntry(id)
      .then(entry => {
        const { title: date } = entry; // TODO: fix title -> date

        return this.setState({ entry, date: moment(date) });
      })
      .catch(err => {
        // TODO: handle this at a higher level
        if (err.status === 401) {
          return history.push('/login');
        }

        console.log('Error fetching entry!', err);
      });
  }

  componentDidUpdate(prevProps: EntryProps, prevState: EntryState) {
    const { isEditing } = this.state;
    const { isEditing: wasEditing } = prevState;

    if (!wasEditing && isEditing) {
      const el = (this.refs.entryInput as HTMLInputElement);

      el.focus();
    }
  }

  updateEntryContent(e: any) {
    const { value: content } = e.target;
    const { entry } = this.state;

    this.setState({
      entry: { ...entry, content }
    });
  }

  saveEntryContent() {
    this.setState({ isSaving: true });

    const { entry } = this.state;
    const { id, content = '' } = entry;

    return updateEntry(id, { content: content.trim() })
      .then(update => {
        this.setState({ entry: update, isEditing: false });
      })
      .then(() => {
        const delay = 1400;

        setTimeout(() => this.setState({ isSaving: false }), delay);
      })
      .catch(err => {
        console.log('Error updating entry!', err);

        this.setState({ isEditing: false, isSaving: false });
      });
  }

  render() {
    const { date, entry, isEditing, isSaving } = this.state;
    const { content = '' } = entry;
    const { history } = this.props;

    // const width = this.refs.entryInput && this.refs.entryInput.clientWidth;
    const lines = content.split('\n')
      .map((l: string) => Math.ceil((l.length + 1) / 65))
      .reduce((total: number, count: number) => total + count, 1);
    const rows = Math.max(lines, 8);

    console.log(rows);

    return (
      <div>
        <NavBar
          title='Log'
          linkTo='/'
          history={history} />

        <div className={`default-container ${isEditing ? 'edit-mode' : 'view-mode'}`}>
          <div className='clearfix'>
            <h3 className='text-light pull-left'>
              {date.format('dddd MMMM DD, YYYY')}
            </h3>

            <button className='btn-default btn-saving pull-right'>
              {isSaving ? 'Saving...' : 'Saved'}
              <img
                className={`saving-icon ${isSaving ? 'hidden' : ''}`}
                src='assets/check.svg' />
            </button>

            {/* TODO: edit button? */}
          </div>

          <div className='clearfix'>
            <div className='entry-container pull-left'>
              {
                isEditing ?
                  <textarea
                    rows={rows}
                    name='content'
                    ref='entryInput'
                    className='edit-entry-textarea'
                    placeholder='Type here!'
                    value={content}
                    onChange={this.updateEntryContent.bind(this)}
                    onBlur={this.saveEntryContent.bind(this)}>
                  </textarea> :
                  <div className='entry-content'
                    dangerouslySetInnerHTML={
                      formatHTML(content || 'Click here to start typing!')
                    }
                    onClick={() => this.setState({ isEditing: true })}>
                  </div>
              }
            </div>

            <div className='entry-prompts-container pull-right'>
              <EntryPrompts />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EntryContainer;

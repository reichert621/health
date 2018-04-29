import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import * as moment from 'moment';
import NavBar from '../navbar';
import { fetchEntry, updateEntry } from '../../helpers/entries';
import { isDateToday } from '../../helpers/utils';
import md from '../../helpers/markdown';
import './Entry.less';

const formatHTML = (content = '') => {
  return { __html: md(content) };
};

const estimateLinesOfContent = (content = '', n = 65): number => {
  return content.split('\n')
    .map((l: string) => Math.ceil((l.length + 1) / n))
    .reduce((total: number, count: number) => total + count, 1);
};

const EntryPrompts = ({ onClose }: { onClose: () => void }) => {
  const styles = {
    container: { marginBottom: 16 },
    title: { marginBottom: 8 },
    icon: { marginTop: 4 }
  };

  return (
    <div className='entry-prompts' style={styles.container}>
      <div className='clearfix'>
        <div className='text-active pull-left' style={styles.title}>
          Prompts
        </div>

        <img className='x-icon pull-right'
          style={styles.icon}
          src='assets/plus-gray.svg'
          onClick={() => onClose()} />
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
  isFullView: boolean;
  isEditing: boolean;
  isSaving: boolean;
}

class EntryContainer extends React.Component<EntryProps, EntryState> {
  constructor(props: EntryProps) {
    super(props);

    this.state = {
      date: moment(),
      entry: {},
      isFullView: false,
      isEditing: false,
      isSaving: false
    };
  }

  componentDidMount() {
    const { match, history } = this.props;
    const { id } = match.params;

    return fetchEntry(id)
      .then(entry => {
        const { date } = entry;

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

  handleKeyDown(e: any) {
    // Allow tab key or [ctrl/cmd + S] to exit edit mode and trigger save
    const isTabbing = e.key === 'Tab';
    const isTryingToSave = e.key === 's' && (e.metaKey || e.ctrlKey);

    if (isTabbing || isTryingToSave) {
      e.preventDefault();
      this.saveEntryContent();
    }
  }

  saveEntry(id: number, updates = {}) {
    this.setState({ isSaving: true });

    return updateEntry(id, updates)
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

  togglePrivateEntry() {
    const { entry } = this.state;
    const { id, isPrivate } = entry;

    return this.saveEntry(id, { isPrivate: !isPrivate });
  }

  saveEntryContent() {
    const { entry } = this.state;
    const { id, content = '' } = entry;

    return this.saveEntry(id, { content: content.trim() });
  }

  render() {
    const { date, entry, isEditing, isSaving, isFullView } = this.state;
    const { content = '', isPrivate } = entry;
    const { history } = this.props;
    const isToday = isDateToday(date);
    const chars = isFullView ? 120 : 65;
    const lines = estimateLinesOfContent(content, chars);

    return (
      <div>
        <NavBar
          title='Log'
          linkTo={isToday ? '/today' : '/dashboard'}
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

            <button
              style={{ marginRight: 8 }}
              className={`pull-right ${
                isPrivate ? 'btn-default' : 'btn-primary'
              }`}
              onClick={this.togglePrivateEntry.bind(this)}>
              {isPrivate ? 'Private' : 'Public'}
            </button>

            {/* TODO: edit button? */}
          </div>

          <div className='clearfix'>
            <div className={`entry-container pull-left ${
              isFullView ? 'full-width' : ''}`
            }>
              {
                isEditing ?
                  <textarea
                    rows={Math.max(lines, 8)}
                    name='content'
                    ref='entryInput'
                    className='edit-entry-textarea'
                    placeholder='Type here!'
                    value={content}
                    onChange={this.updateEntryContent.bind(this)}
                    onKeyDown={this.handleKeyDown.bind(this)}
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

            <div className={`entry-prompts-container pull-right ${
              isFullView ? 'hidden' : ''}`
            }>
              <EntryPrompts
                onClose={() => this.setState({ isFullView: true })} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EntryContainer;

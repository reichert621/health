import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import * as moment from 'moment';
import { all } from 'bluebird';
import NavBar from '../navbar';
import { fetchUserEntry } from '../../helpers/entries';
import { isAuthenticated } from '../../helpers/auth';
import md from '../../helpers/markdown';
import './Entry.less';

const formatHTML = (content = '') => {
  return { __html: md(content) };
};

interface EntryProps extends RouteComponentProps<{ id: number, username: string }> {
  // TODO
}

interface EntryState {
  date: moment.Moment;
  isLoggedIn: boolean;
  entry: any;
}

class UserEntryContainer extends React.Component<EntryProps, EntryState> {
  constructor(props: EntryProps) {
    super(props);

    this.state = {
      date: moment(),
      isLoggedIn: false,
      entry: {}
    };
  }

  componentDidMount() {
    const { match, history } = this.props;
    const { id, username } = match.params;

    return all([
      isAuthenticated(),
      fetchUserEntry(username, id)
    ])
      .then(([isLoggedIn, entry]) => {
        const { date } = entry;

        return this.setState({ entry, isLoggedIn, date: moment(date) });
      })
      .catch(err => {
        console.log('Error fetching entry!', err);

        return history.push('/login');
      });
  }

  render() {
    const { date, entry, isLoggedIn } = this.state;
    const { content = '' } = entry;
    const { history, match } = this.props;
    const { username } = match.params;

    return (
      <div>
        <NavBar
          title={username}
          linkTo={`/@${username}`}
          history={isLoggedIn ? history : null} />

        <div className='default-container view-mode'>
          <div className='clearfix'>
            <h3 className='text-light pull-left'>
              {date.format('dddd MMMM DD, YYYY')}
            </h3>
          </div>

          <div className='clearfix'>
            <div className='entry-container full-width'>
              <div className='entry-content'
                dangerouslySetInnerHTML={
                  formatHTML(content || 'Click here to start typing!')
                }>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UserEntryContainer;

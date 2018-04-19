import * as React from 'react';
import * as moment from 'moment';
import { RouteComponentProps } from 'react-router-dom';
import { all } from 'bluebird';
import NavBar from '../navbar';
import EntryPreview from '../entry/EntryPreview';
import { isAuthenticated } from '../../helpers/auth';
import { Entry, fetchUserEntries } from '../../helpers/entries';
import './Home.less';

interface ProfileProps extends RouteComponentProps<{ username: string }> {}

interface ProfileState {
  username: string;
  isLoggedIn: boolean;
  entries: Entry[];
}

class Profile extends React.Component<ProfileProps, ProfileState> {
  constructor(props: ProfileProps) {
    super(props);

    const { match } = this.props;
    const { username } = match.params;

    this.state = {
      username,
      isLoggedIn: false,
      entries: []
    };
  }

  componentDidMount() {
    const { username } = this.state;
    const { history } = this.props;

    return all([
      isAuthenticated(),
      fetchUserEntries(username)
    ])
      .then(([isLoggedIn, entries]) => {
        this.setState({ isLoggedIn, entries });
      })
      .catch(err => {
        console.log('Error fetching user entries!', err);

        return history.push('/login');
      });
  }

  renderEntries() {
    const { username, entries = [] } = this.state;

    if (!entries || !entries.length) {
      return (
        <div className='text-center'>
          <span className='text-blue'>{username} </span>
          <span>has not published anything yet!</span>
        </div>
      );
    }

    return entries
      .sort((x, y) => {
        return Number(new Date(y.date)) - Number(new Date(x.date));
      })
      .map(entry => {
        const { id, date } = entry;
        const formatted = { ...entry, date: moment(date) };
        const linkTo = `/@${username}/entry/${id}`;

        return (
          <EntryPreview
            key={id}
            entry={formatted}
            linkTo={linkTo} />
        );
      });
  }
  render() {
    const { isLoggedIn, username } = this.state;
    const { history } = this.props;

    return (
      <div>
        <NavBar
          title={username}
          history={isLoggedIn ? history : null} />

        <div className='default-container'>
          <div className='entry-list-container'>
            {this.renderEntries()}
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;

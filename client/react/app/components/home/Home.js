import React from 'react';
import moment from 'moment';
import NavBar from '../navbar';
import EntryPreview from '../entry/EntryPreview';
import { fetchEntries } from '../../helpers/entries';
import { logout } from '../../helpers/auth';
import './Home.less';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      entries: []
    };
  }

  componentDidMount() {
    const { history } = this.props;

    return fetchEntries()
      .then(entries => this.setState({ entries }))
      .catch(err => {
        console.log('Error fetching entries!', err);

        return history.push('/login');
      });
  }

  renderEntries() {
    const { entries = [] } = this.state;

    if (!entries || !entries.length) {
      return null;
    }

    return entries
      .sort((x, y) => {
        return Number(new Date(y.date)) - Number(new Date(x.date));
      })
      .map(entry => {
        const { id, date } = entry;
        const formatted = { ...entry, date: moment(date) };
        const linkTo = `/entry/${id}`;

        return (
          <EntryPreview
            key={id}
            entry={formatted}
            linkTo={linkTo} />
        );
      });
  }

  logout() {
    const { history } = this.props;

    return logout()
      .then(res => {
        return history.push('/login');
      })
      .catch(err => {
        console.log('Error logging out!', err);
      });
  }

  render() {
    const { history } = this.props;

    return (
      <div>
        <NavBar
          title='Blog'
          linkTo='/'
          history={history} />

        <div className='default-container'>
          <div className='entry-list-container'>
            {this.renderEntries()}
          </div>
        </div>
      </div>
    );
  }
}

export default Home;

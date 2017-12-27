import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { fetchChecklists } from '../../helpers/checklist';
import './CheckList.less';

class CheckLists extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checklists: []
    };
  }

  componentDidMount() {
    return fetchChecklists()
      .then(checklists => {
        return this.setState({ checklists });
      })
      .catch(err =>
        console.log('Error fetching checklists!', err));
  }

  render() {
    const { checklists } = this.state;

    return (
      <div className="default-container">
        <Link to="/">Back</Link>
        <h1>
          Checklists
        </h1>
        <Link to="/checklist/new">New Checklist</Link>
        <ul>
          {
            checklists
              .sort((x, y) => {
                return Number(new Date(y.date)) - Number(new Date(x.date));
              })
              .map(({ id, date }, key) => {
                return (
                  <li key={key}>
                    <Link to={`/checklist/${id}`}>
                      {moment(date).format('MMM DD, YYYY')}
                    </Link>
                    <span>
                      {moment().isSame(moment(date), 'day') ? ' (Today)' : ''}
                    </span>
                  </li>
                );
              })
          }
        </ul>
      </div>
    );
  }
}

export default CheckLists;

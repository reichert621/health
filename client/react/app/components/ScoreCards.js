import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { fetchScorecards } from '../helpers/scorecard';
import './ScoreCard.less';

class ScoreCards extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scorecards: []
    };
  }

  componentDidMount() {
    return fetchScorecards()
      .then(scorecards => {
        return this.setState({ scorecards });
      })
      .catch(err =>
        console.log('Error fetching scorecards!', err));
  }

  render() {
    const { scorecards } = this.state;

    return (
      <div className="default-container">
        <Link to="/">Back</Link>
        <h1>
          Scorecards
        </h1>
        <Link to="/scorecard/new">New Scorecard</Link>
        <ul>
          {
            scorecards
              .sort((x, y) => {
                return Number(new Date(y.date)) - Number(new Date(x.date));
              })
              .map(({ id, date }, key) => {
                return (
                  <li key={key}>
                    <Link to={`/scorecard/${id}`}>
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

export default ScoreCards;

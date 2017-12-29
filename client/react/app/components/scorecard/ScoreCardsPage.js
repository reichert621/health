import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import ScoreCards from './ScoreCards';
import { fetchScorecards } from '../../helpers/scorecard';
import './ScoreCard.less';

class ScoreCardsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      scorecards: []
    };
  }

  componentDidMount() {
    return fetchScorecards()
      .then(scorecards =>
        this.setState({ scorecards }))
      .catch(err =>
        console.log('Error fetching scorecards!', err));
  }

  render() {
    const { scorecards } = this.state;
    const { limit = 40 } = this.props;

    return (
      <div className="default-container">
        <Link to="/">Back</Link>
        <h1>
          Scorecards
        </h1>
        <Link to="/scorecard/new">New Scorecard</Link>
        <ScoreCards
          scorecards={scorecards}
          limit={limit} />
      </div>
    );
  }
}

export default ScoreCardsPage;

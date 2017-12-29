import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import ScoreCards from '../scorecard/ScoreCards';
import { fetchScorecards } from '../../helpers/scorecard';
import '../scorecard/ScoreCard.less';

// TODO: DRY up (see ScoreCardsPage)
class DashboardScoreCards extends React.Component {
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
    const { limit = 5 } = this.props;

    return (
      <div className="default-container">
        <h2>
          Scorecards
        </h2>
        <Link to="/scorecard/new">New Scorecard</Link>
        <ScoreCards
          scorecards={scorecards}
          limit={limit} />
        <Link to="/scorecards">View All</Link>
      </div>
    );
  }
}

export default DashboardScoreCards;

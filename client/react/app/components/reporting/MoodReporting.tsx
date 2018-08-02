import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import NavBar from '../navbar';
import MoodReportingChart from './MoodReportingChart';
import MoodReportingTable from './MoodReportingTable';
import { ReportingStats, fetchAllStats } from '../../helpers/reporting';
import './Reporting.less';

interface ReportingState {
  stats: ReportingStats;
}

class MoodReporting extends React.Component<RouteComponentProps<{}>, ReportingState> {
  constructor(props: RouteComponentProps<{}>) {
    super(props);

    this.state = {
      stats: {} as ReportingStats
    };
  }

  componentDidMount() {
    // TODO: only fetch required stats
    return fetchAllStats()
      .then(stats => this.setState({ stats }))
      .catch(err => {
        console.log('Error fetching stats!', err);
      });
  }

  render() {
    const { history } = this.props;
    const { stats } = this.state;
    const {
      depressionQuestionStats = [],
      anxietyQuestionStats = [],
      wellnessQuestionStats = []
    } = stats;

    return (
      <div>
        <NavBar
          title='Mood Reporting'
          linkTo='/reporting'
          history={history} />

        <div className='default-container'>
          {/* TODO: format this better */}
          {/* <MoodReportingChart /> */}
          <h1>Depression Questions</h1>
          <MoodReportingTable stats={depressionQuestionStats} />

          <h1>Anxiety Questions</h1>
          <MoodReportingTable stats={anxietyQuestionStats} />

          <h1>Well-being Questions</h1>
          <MoodReportingTable stats={wellnessQuestionStats} />
        </div>
      </div>
    );
  }
}

export default MoodReporting;

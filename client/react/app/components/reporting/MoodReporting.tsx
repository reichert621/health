import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { groupBy } from 'lodash';
import NavBar from '../navbar';
import AssessmentReportingTable from './AssessmentReportingTable';
import { IAssessmentQuestionStat } from '../../helpers/assessment';
import { fetchAssessmentQuestionStats } from '../../helpers/reporting';
import './Reporting.less';

const POSITIVE = 1;
const NEGATIVE = -1;

interface ReportingState {
  stats: IAssessmentQuestionStat[];
}

class MoodReporting extends React.Component<
  RouteComponentProps<{}>,
  ReportingState
> {
  constructor(props: RouteComponentProps<{}>) {
    super(props);

    this.state = {
      stats: []
    };
  }

  componentDidMount() {
    // TODO: only fetch required stats
    return fetchAssessmentQuestionStats()
      .then(stats => this.setState({ stats }))
      .catch(err => {
        console.log('Error fetching stats!', err);
      });
  }

  render() {
    const { history } = this.props;
    const { stats } = this.state;
    const grouped = groupBy(stats, (stat) => stat.question.type);
    const { depression = [], anxiety = [], wellbeing = [] } = grouped;

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
          <AssessmentReportingTable
            stats={depression}
            direction={NEGATIVE} />

          <h1>Anxiety Questions</h1>
          <AssessmentReportingTable
            stats={anxiety}
            direction={NEGATIVE} />

          <h1>Well-being Questions</h1>
          <AssessmentReportingTable
            stats={wellbeing}
            direction={POSITIVE} />
        </div>
      </div>
    );
  }
}

export default MoodReporting;

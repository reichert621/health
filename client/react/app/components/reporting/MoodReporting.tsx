import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { groupBy } from 'lodash';
import NavBar from '../navbar';
import AssessmentReportingTable from './AssessmentReportingTable';
import { IAssessmentQuestionStat } from '../../helpers/assessment';
import { fetchAssessmentQuestionStats } from '../../helpers/reporting';
import { getDefaultDateRange } from '../../helpers/utils';
import './Reporting.less';

const POSITIVE = 1;
const NEGATIVE = -1;

interface ReportingState {
  startDate: string;
  endDate: string;
  stats: IAssessmentQuestionStat[];
}

class MoodReporting extends React.Component<
  RouteComponentProps<{}>,
  ReportingState
> {
  constructor(props: RouteComponentProps<{}>) {
    super(props);

    const query = props.location.search;
    const { startDate, endDate } = getDefaultDateRange(query);

    this.state = {
      startDate,
      endDate,
      stats: []
    };
  }

  componentDidMount() {
    const { startDate, endDate } = this.state;

    return fetchAssessmentQuestionStats({ startDate, endDate })
      .then(stats => this.setState({ stats }))
      .catch(err => {
        console.log('Error fetching stats!', err);
      });
  }

  render() {
    const { history } = this.props;
    const { stats } = this.state;
    const grouped = groupBy(stats, stat => stat.question.type);
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

          <h1>Depression</h1>
          <AssessmentReportingTable
            title='Depression'
            stats={depression}
            direction={NEGATIVE} />

          <h1>Anxiety</h1>
          <AssessmentReportingTable
            title='Anxiety'
            stats={anxiety}
            direction={NEGATIVE} />

          <h1>Well-being</h1>
          <AssessmentReportingTable
            title='Well-being'
            stats={wellbeing}
            direction={POSITIVE} />
        </div>
      </div>
    );
  }
}

export default MoodReporting;

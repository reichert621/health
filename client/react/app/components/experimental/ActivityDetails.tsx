import * as React from 'react';
import { fetchStatsById } from '../../helpers/tasks';
import { H2, Container, FlexContainer } from './Common';
import IntensityMeter from './IntensityMeter';
import ActivityMoodScores from './ActivityMoodScores';
import MoodScoreChart from './MoodScoreChart';
import PastWeek from './PastWeek';
import HeatMap from './HeatMap';

const IntensityLevel = () => {
  return (
    <Container mb={32}>
      <div className="activity-details-label">
        <span>Intensity &mdash; </span>
        <span className="text-heavy">Very High</span>
      </div>

      <div className="intensity-levels-container">
        <div className="intensity-level very-low" />
        <div className="intensity-level low" />
        <div className="intensity-level high" />
        <div className="intensity-level very-high" />
      </div>
    </Container>
  );
};

// TODO: why is this rendering poorly in Chrome?
const MoodScoreMeter = ({ label, width }: { label: string; width: number }) => {
  const style = { width: `${width || 0}%` };

  return (
    <Container mb={16}>
      <div className="activity-details-label">{label}</div>

      <div className="mood-score-meter-container">
        <div className="mood-score-meter" style={style} />
      </div>
    </Container>
  );
};

interface ActivityDetailProps {
  taskId?: number;
  onClose: () => void;
}

interface ActivityDetailState {
  stats: any;
}

class ActivityDetails extends React.Component<
  ActivityDetailProps,
  ActivityDetailState
> {
  constructor(props: ActivityDetailProps) {
    super(props);

    this.state = {
      stats: null
    };
  }

  componentWillReceiveProps({ taskId }: ActivityDetailProps) {
    return this.fetchTaskStats(taskId);
  }

  componentDidMount() {
    const { taskId } = this.props;

    return this.fetchTaskStats(taskId);
  }

  fetchTaskStats(taskId: number) {
    return fetchStatsById(taskId)
      .then(stats => this.setState({ stats }))
      .catch(err => console.log('Error fetching task stats!', err));
  }

  render() {
    const { stats } = this.state;
    const { onClose } = this.props;

    if (!stats) {
      return null; // Loading?
    }

    const { task, dates, stats: assessments } = stats;
    const { category, ability, description, points } = task;
    const { wellbeing, anxiety, depression } = assessments;
    const heat = dates.map((date: string) => {
      return [Number(new Date(date)), points];
    });

    return (
      <div className="activity-details-container">
        <FlexContainer justifyContent="space-between" alignItems="flex-start">
          <H2 mb={16}>
            {category}: {description}
          </H2>
          {/* TODO: replace with an 'X' icon? */}
          <div className="close-activity-details" onClick={onClose}>
            Close
          </div>
        </FlexContainer>

        <Container mb={24} className="tags-container">
          <span className="tag-box purple">{ability}</span>
          <span className="tag-box blue">{category}</span>
        </Container>

        <IntensityMeter points={points} />

        {/* <IntensityLevel /> */}

        <HeatMap stats={heat} />

        <PastWeek dates={dates} />

        {/* <MoodScoreMeter label='Depression' width={8} />
        <MoodScoreMeter label='Anxiety' width={15} />
        <MoodScoreMeter label='Well-being' width={62} /> */}

        <Container mt={32} mb={32}>
          <div className="activity-details-label">Health Impact</div>

          <FlexContainer justifyContent="space-between">
            <MoodScoreChart
              title="Depression"
              score={depression.included}
              delta={depression.delta}
              mini={false}
            />

            <MoodScoreChart
              title="Anxiety"
              score={anxiety.included}
              delta={anxiety.delta}
              mini={false}
            />

            <MoodScoreChart
              title="Wellness"
              score={wellbeing.included}
              delta={wellbeing.delta}
              mini={false}
            />
          </FlexContainer>
        </Container>

        <ActivityMoodScores scores={assessments} />
      </div>
    );
  }
}

export default ActivityDetails;

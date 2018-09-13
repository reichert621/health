import * as React from 'react';
import * as ReactHighcharts from 'react-highcharts';
import * as moment from 'moment';
import { times, capitalize, first, last, chunk } from 'lodash';
import { fetchStatsById } from '../../helpers/tasks';
import { getStreakStats, DATE_FORMAT } from '../../helpers/utils';

const colors = {
  BLUE: '#80A0C0',
  LIGHT_BEIGE: '#FBF6F0',
  BEIGE: '#F4E6DB',
  WHITE: '#fff',
  BLACK: '#382210',
  RED: '#C76666',
  ORANGE: '#E5AF70',
  ORANGE_BROWN: '#E6AF70',
  LIGHT_GREEN: '#C7D99A',
  DARK_GREEN: '#708045',
  LIGHT_BROWN: '#B88C5A',
  PURPLE: '#A68AC1'
};

const IntensityMeter = ({ points }: { points: number }) => {
  const mappings: { [points: string]: string; } = {
    1: 'Very Low',
    2: 'Low',
    4: 'High',
    8: 'Very High'
  };

  const intensity = mappings[points] || 'Very Low';

  return (
    <div style={{ marginBottom: 32 }}>
      <div className='activity-details-label'>
        <span>Intensity &mdash; </span>
        <span className='text-heavy'>{intensity}</span>
      </div>

      <div className='activity-intensity-bar'>
        <div className={`intensity-section ${points > 0 ? 'very-low' : ''}`} />
        <div className={`intensity-section ${points > 1 ? 'low' : ''}`} />
        <div className={`intensity-section ${points > 2 ? 'high' : ''}`} />
        <div className={`intensity-section ${points > 4 ? 'very-high' : ''}`} />
      </div>
    </div>
  );
};

const IntensityLevel = () => {
  return (
    <div style={{ marginBottom: 32 }}>
      <div className='activity-details-label'>
        <span>Intensity &mdash; </span>
        <span className='text-heavy'>Very High</span>
      </div>

      <div className='intensity-levels-container'>
        <div className='intensity-level very-low' />
        <div className='intensity-level low' />
        <div className='intensity-level high' />
        <div className='intensity-level very-high' />
      </div>
    </div>
  );
};

const HeatMap = ({ stats }: { stats: number[][] }) => {
  const weeks = 30;
  const days = weeks * 7;
  const scores = stats.map(([ts, score]) => score).sort((x, y) => x - y);
  const count = scores.filter(s => s > 0).length;
  const formatted = stats.map(([ts, score]) => {
    return { date: moment(ts).format(DATE_FORMAT), score };
  }).reverse();
  const streaks = getStreakStats(formatted);
  const mappedScores = stats.reduce((mappings, s) => {
    const [ts, score] = s;
    const date = moment(ts).format(DATE_FORMAT);

    return { ...mappings, [date]: score };
  }, {} as { [date: string]: number; });

  const today = '2018-08-01'; // FIXME (hardcoded for testing)
  const scoresByDay = times(days, n => {
    const date = moment(today).subtract(n, 'days').format(DATE_FORMAT);
    const score = mappedScores[date] || 0;

    return { date, score };
  }).reverse();

  const scoresByWeek = chunk(scoresByDay, 7);
  const colorMappings: { [points: string]: string; } = {
    0: colors.LIGHT_BEIGE,
    1: colors.BEIGE,
    2: colors.BEIGE, // TODO: find better colors
    4: colors.ORANGE_BROWN,
    8: colors.LIGHT_BROWN
  };

  const style = (score: number) => {
    return {
      backgroundColor: colorMappings[score] || colors.LIGHT_BEIGE
    };
  };

  return (
    <div style={{ marginBottom: 32 }}>
      <div className='activity-labels-container'>
        <div className='activity-details-label'>
          <span>Streak &mdash; </span>
          <span className='text-heavy'>{first(streaks)} days</span>
        </div>

        <div className='activity-details-label'>
          <span>Total Completed &mdash; </span>
          <span className='text-heavy'>{count} days</span>
        </div>
      </div>

      <div className='heat-map-container'>
        {
          times(7, index => {
            return (
              <div key={index} className='heat-row'>
                {
                  scoresByWeek.map(w => {
                    const { date, score } = w[index];

                    return (
                      <div
                        key={date}
                        className='heat-box'
                        style={style(score)}
                      />
                    );
                  })
                }
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

const PastWeek = ({ dates }: { dates: string[] }) => {
  const days = ['sun', 'mon', 'tues', 'wed', 'thurs', 'fri', 'sat'];
  const today = '2018-08-01'; // TODO: hardcoded for testing
  const completedDates = dates.reduce((acc, date) => {
    const key = moment(date).format(DATE_FORMAT);

    return { ...acc, [key]: true };
  }, {} as { [date: string]: boolean });

  const pastWeekDates = times(7, n => {
    const date = moment(today).subtract(n, 'days');
    const day = days[date.day()];
    const formatted = moment(date).format(DATE_FORMAT);
    const label = day.slice(0, 1).toUpperCase();

    return { day, label, isComplete: completedDates[formatted] };
  }).reverse();

  return (
    <div className='activity-past-week-container' style={{ marginBottom: 32 }}>
      <div className='activity-labels-container'>
        <div className='activity-details-label'>Past Week</div>

        <div className='activity-details-label text-heavy'>Today</div>
      </div>

      <div className='activity-past-week'>
        {
          pastWeekDates.map(({ day, label, isComplete }) => {
            const completed = isComplete ? 'completed' : '';

            return (
              <div key={day} className={`activity-week-day ${day} ${completed}`}>
                {label}
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

// TODO: why is this rendering poorly in Chrome?
const MoodScoreMeter = ({ label, width }: { label: string; width: number; }) => {
  const style = { width: `${width || 0}%` };

  return (
    <div style={{ marginBottom: 16 }}>
      <div className='activity-details-label'>{label}</div>

      <div className='mood-score-meter-container'>
        <div className='mood-score-meter' style={style} />
      </div>
    </div>
  );
};

const MoodScoreChart = ({ title, score, delta, mini }: {
  title: string;
  score: number;
  delta: number;
  mini?: boolean;
}) => {
  // TODO: fix this logic
  const level = delta < 1 ? 'low' : delta < 4 ? 'moderate' : 'high';
  const impact = capitalize(level);
  const shades = {
    low: colors.LIGHT_GREEN,
    moderate: colors.ORANGE,
    high: colors.BLUE
  };
  const color = shades[level];
  const config = {
    title: {
      verticalAlign: 'middle',
      align: 'center',
      floating: true,
      text: mini ? '' : title,
      y: 6,
      style: {
        fontSize: '12px',
        fontWeight: '500',
        color: colors.LIGHT_BROWN
      }
    },
    chart: {
      type: 'pie',
      height: mini ? 80 : 100,
      width: mini ? 80 : 100,
      margin: [0, 0, 0, 0],
      style: {
        fontFamily: '"Quicksand", "Helvetica Neue", Arial, san-serif'
      }
    },
    plotOptions: {
      pie: {
        innerSize: '90%',
        cursor: 'pointer',
        dataLabels: {
          enabled: false,
        },
        states: {
          hover: {
            enabled: false,
            halo: false
          }
        },
        colors: [
          colors.BLACK,
          color,
          colors.LIGHT_BEIGE
        ]
      }
    },
    credits: false,
    tooltip: { enabled: false, shadow: false },
    series: [
      {
        id: 'scores',
        name: 'Scores',
        data: [
          [0, score],
          [1, Math.abs(delta)],
          [2, 100 - (score + Math.abs(delta))]
        ]
      }
    ]
  };

  const style = { backgroundColor: color };

  return (
    <div className='mood-score-chart-container'
      style={{ width: '33%', flexDirection: 'column' }}>
      <ReactHighcharts config={config} />
      <div className={`mood-score-label`} style={style}>
        {impact}
      </div>
    </div>
  );
};

const ActivityMoodScores = ({ scores }: { scores: any }) => {
  const { depression, anxiety, wellbeing } = scores;
  console.log({ depression, anxiety, wellbeing });

  // TODO
  return (
    <div>
      <div className='activity-details-label'>Average Scores</div>

      <div className='activity-mood-scores-container'>
        <div className='activity-mood-score-row'>
          <div className='mood-score-cell'>&nbsp;</div>
          <div className='mood-score-cell label-cell'>With</div>
          <div className='mood-score-cell label-cell'>Without</div>
          <div className='mood-score-cell label-cell'>Delta</div>
        </div>

        <div className='activity-mood-score-row'>
          <div className='mood-score-cell label-cell'>Depression</div>
          <div className='mood-score-cell'>
            {(depression.included || 0).toFixed(1)}%
          </div>
          <div className='mood-score-cell'>
            {(depression.excluded || 0).toFixed(1)}%
          </div>
          <div className={`mood-score-cell ${
            depression.delta < 0 ? 'negative' : 'positive'
          }`}>
            {depression.delta < 0 ? '-' : '+'}{Math.abs(depression.delta).toFixed(1)}%
          </div>
        </div>

        <div className='activity-mood-score-row'>
          <div className='mood-score-cell label-cell'>Anxiety</div>
          <div className='mood-score-cell'>
            {(anxiety.included || 0).toFixed(1)}%
          </div>
          <div className='mood-score-cell'>
            {(anxiety.excluded || 0).toFixed(1)}%
          </div>
          <div className={`mood-score-cell ${
            anxiety.delta < 0 ? 'negative' : 'positive'
          }`}>
            {anxiety.delta < 0 ? '-' : '+'}{Math.abs(anxiety.delta).toFixed(1)}%
          </div>
        </div>

        <div className='activity-mood-score-row'>
          <div className='mood-score-cell label-cell'>Well-being</div>
          <div className='mood-score-cell'>
            {(wellbeing.included || 0).toFixed(1)}%
          </div>
          <div className='mood-score-cell'>
            {(wellbeing.excluded || 0).toFixed(1)}%
          </div>
          <div className={`mood-score-cell ${
            wellbeing.delta < 0 ? 'negative' : 'positive'
          }`}>
            {wellbeing.delta < 0 ? '-' : '+'}{Math.abs(wellbeing.delta).toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};

interface ActivityDetailProps {
  taskId?: number;
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
      <div className='activity-details-container'>
        <h2 className='activity-name' style={{ marginBottom: 16 }}>
          {category}: {description}
        </h2>

        <div className='tags-container' style={{ marginBottom: 24 }}>
          <span className='tag-box purple'>{ability}</span>
          <span className='tag-box blue'>{category}</span>
        </div>

        <IntensityMeter points={points} />

        {/* <IntensityLevel /> */}

        <HeatMap stats={heat} />

        <PastWeek dates={dates} />

        {/* <MoodScoreMeter label='Depression' width={8} />
        <MoodScoreMeter label='Anxiety' width={15} />
        <MoodScoreMeter label='Well-being' width={62} /> */}

        <div style={{ marginTop: 32, marginBottom: 32 }}>
          <div className='activity-details-label'>Health Impact</div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <MoodScoreChart
              title='Depression'
              score={depression.included}
              delta={depression.delta}
              mini={false} />

            <MoodScoreChart
              title='Anxiety'
              score={anxiety.included}
              delta={anxiety.delta}
              mini={false} />

            <MoodScoreChart
              title='Wellness'
              score={wellbeing.included}
              delta={wellbeing.delta}
              mini={false} />
          </div>
        </div>

        <ActivityMoodScores scores={assessments} />
      </div>
    );
  }
}

export default ActivityDetails;

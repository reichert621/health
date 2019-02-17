import * as React from 'react';
import * as moment from 'moment';
import { times, first, chunk } from 'lodash';
import { getStreakStats, DATE_FORMAT } from '../../helpers/utils';
import colors from '../../helpers/colors';
import { Container } from './Common';

const HeatMap = ({ stats }: { stats: number[][] }) => {
  const weeks = 30;
  const days = weeks * 7;
  const scores = stats.map(([ts, score]) => score).sort((x, y) => x - y);
  const count = scores.filter(s => s > 0).length;
  const formatted = stats
    .map(([ts, score]) => {
      return { date: moment(ts).format(DATE_FORMAT), score };
    })
    .reverse();
  const streaks = getStreakStats(formatted);
  const mappedScores = stats.reduce(
    (mappings, s) => {
      const [ts, score] = s;
      const date = moment(ts).format(DATE_FORMAT);

      return { ...mappings, [date]: score };
    },
    {} as { [date: string]: number }
  );

  const scoresByDay = times(days, n => {
    const date = moment()
      .subtract(n, 'days')
      .format(DATE_FORMAT);
    const score = mappedScores[date] || 0;

    return { date, score };
  }).reverse();

  const scoresByWeek = chunk(scoresByDay, 7);
  const colorMappings: { [points: string]: string } = {
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
    <Container mb={32}>
      <div className="activity-labels-container">
        <div className="activity-details-label">
          <span>Streak &mdash; </span>
          <span className="text-heavy">{first(streaks)} days</span>
        </div>

        <div className="activity-details-label">
          <span>Total Completed &mdash; </span>
          <span className="text-heavy">{count} days</span>
        </div>
      </div>

      <div className="heat-map-container">
        {times(7, index => {
          return (
            <div key={index} className="heat-row">
              {scoresByWeek.map(w => {
                const { date, score } = w[index];

                return (
                  <div key={date} className="heat-box" style={style(score)} />
                );
              })}
            </div>
          );
        })}
      </div>
    </Container>
  );
};

export default HeatMap;

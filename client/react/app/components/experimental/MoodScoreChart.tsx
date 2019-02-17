import * as React from 'react';
import * as ReactHighcharts from 'react-highcharts';
import { capitalize } from 'lodash';
import colors from '../../helpers/colors';

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

export default MoodScoreChart;

import * as React from 'react';
import * as ReactHighcharts from 'react-highcharts';
import { keys } from 'lodash';

interface MoodFrequencyProps {
  stats: {
    [level: string]: number;
  };
}

interface MoodColorMap {
  [mood: string]: string;
}

const MoodFrequencyChart = ({ stats }: MoodFrequencyProps) => {
  const colors: MoodColorMap = {
    'No depression': '#D2D2D2',
    'Normal but unhappy': '#B8DBE9',
    'Mild depression': '#8BC9E1',
    'Moderate depression': '#72BFDB',
    'Severe depression': '#4FAED1',
    'Extreme depression': '#33A2CC'
  };

  const frequencies = keys(stats).map(level => {
    const count = stats[level];

    return {
      id: level,
      name: level,
      color: colors[level],
      y: count
    };
  });

  const config = {
    title: { text: '' },
    chart: {
      height: 240,
      type: 'pie',
      style: {
        fontFamily: 'Helvetica Neue',
        letterSpacing: '0.6px'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: false
        }
      }
    },
    tooltip: {
      borderColor: '#D2D2D2',
      formatter() {
        const { key, percentage } = this;
        return `
          <div>${key} - ${percentage.toFixed(1)}%</div>
        `;
      }
    },
    credits: false,
    series: [{ data: frequencies }]
  };

  return (
    <div>
      <ReactHighcharts config={config} />
    </div>
  );
};

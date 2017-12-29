import React from 'react';
import { Link } from 'react-router-dom';
import Highcharts from 'react-highcharts';
import './Reporting.less';

const ReportingChart = ({ stats = {} }) => {
  const { checklist, scorecard } = stats;
  const config = {
    title: { text: '' },
    xAxis: {
      type: 'datetime'
    },
    yAxis: {
      title: {
        text: 'Points'
      }
    },
    credits: false,
    series: [
      {
        id: 'checklist',
        name: 'Depression',
        data: checklist
      }, {
        id: 'scorecard',
        name: 'Productivity',
        data: scorecard
      }
    ]
  };

  return (
    <div>
      <Highcharts config={config} />
    </div>
  );
};

export default ReportingChart;

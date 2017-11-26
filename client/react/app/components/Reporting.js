import React from 'react';
import Highcharts from 'react-highcharts';
import './Reporting.less';

class Reporting extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // TODO: use real data
    const config = {
      title: { text: 'Reports' },
      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 295.6, 454.4]
      }]
    };

    return (
      <div className="default-container">
        <h1>Reporting</h1>

        <Highcharts config={config} />
      </div>
    );
  }
}

export default Reporting;

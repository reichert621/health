import * as React from 'react';
import * as ReactHighcharts from 'react-highcharts';
import * as moment from 'moment';
import { isEqual } from 'lodash';
import { FlexContainer, Color } from './Common';
import AnalyticsChartLabel from './AnalyticsChartLabel';

interface ChartProps {
  activity: number[][];
  depression: number[][];
  anxiety: number[][];
  wellbeing: number[][];
}

class AnalyticsChart extends React.Component<ChartProps> {
  shouldComponentUpdate(nextProps: ChartProps) {
    return !isEqual(nextProps, this.props);
  }

  render() {
    const { activity, depression, anxiety, wellbeing } = this.props;
    const config = {
      title: { text: '' },
      chart: {
        // height: 240,
        height: 320,
        style: {
          fontFamily: '"Quicksand", "Helvetica Neue", Arial, san-serif'
        }
      },
      plotOptions: {
        series: {
          cursor: 'pointer',
          point: {
            events: {
              mouseOver(e: any) {
                console.log(e, this);
              }
            }
          }
        }
      },
      legend: {
        enabled: false
      },
      xAxis: {
        type: 'datetime',
        tickLength: 4,
        tickColor: Color.ORANGE,
        lineColor: Color.ORANGE,
        labels: {
          style: {
            color: Color.LIGHT_BROWN,
            fontSize: 10
          },
          y: 22,
          formatter() {
            return moment(this.value).format('MMM DD');
          }
        }
      },
      yAxis: {
        title: {
          text: ''
        },
        gridLineColor: Color.BEIGE,
        labels: {
          style: {
            color: Color.LIGHT_BROWN,
            fontSize: 10
          }
        },
        opposite: true
      },
      plotLines: {
        color: Color.LIGHT_BROWN
      },
      credits: false,
      series: [
        {
          id: 'scorecard',
          name: 'Productivity',
          color: Color.ORANGE,
          data: activity
        },
        {
          id: 'checklist',
          name: 'Depression',
          color: Color.BLACK,
          data: depression
        },
        {
          id: 'anxiety',
          name: 'Anxiety',
          color: Color.RED,
          data: anxiety
        },
        {
          id: 'wellbeing',
          name: 'Well-Being',
          color: Color.BLUE,
          data: wellbeing
        }
      ]
    };

    return (
      <div
        className="analytics-section-container"
        style={{ flex: 3, marginRight: 16 }}
      >
        <ReactHighcharts config={config} />

        <FlexContainer mt={8} justifyContent="space-around">
          <AnalyticsChartLabel color={Color.BLUE} label="Well-Being" />

          <AnalyticsChartLabel color={Color.ORANGE} label="Activity Level" />

          <AnalyticsChartLabel color={Color.RED} label="Anxiety" />

          <AnalyticsChartLabel color={Color.BLACK} label="Depression" />
        </FlexContainer>
      </div>
    );
  }
}

export default AnalyticsChart;

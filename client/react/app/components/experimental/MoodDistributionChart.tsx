import * as React from 'react';
import * as ReactHighcharts from 'react-highcharts';
import { keys, isEqual } from 'lodash';
import colors from '../../helpers/colors';
import AnalyticsChartLabel from './AnalyticsChartLabel';

interface MoodDistributionProps {
  scores: {
    [label: string]: number;
  };
  label?: string;
}

interface MoodDistributionState {
  hovered: string;
}

class MoodDistributionChart extends React.Component<
  MoodDistributionProps,
  MoodDistributionState
> {
  constructor(props: MoodDistributionProps) {
    super(props);

    this.state = { hovered: null };
  }

  shouldComponentUpdate({ scores }: MoodDistributionProps) {
    return !isEqual(scores, this.props.scores);
  }

  render() {
    const { hovered } = this.state;
    const { scores } = this.props;
    const shades = [
      colors.LIGHT_BEIGE,
      colors.BEIGE,
      colors.ORANGE_BROWN,
      colors.LIGHT_BROWN,
      colors.BLACK
    ];
    const config = {
      title: {
        text: ''
      },
      chart: {
        type: 'pie',
        // height: 100,
        // width: 120,
        height: 120,
        width: 140,
        margin: [0, 0, 0, 0],
        style: {
          fontFamily: '"Quicksand", "Helvetica Neue", Arial, san-serif'
        }
      },
      plotOptions: {
        pie: {
          cursor: 'pointer',
          dataLabels: {
            enabled: false
          },
          states: {
            hover: {
              // enabled: false,
              halo: false
            }
          },
          point: {
            events: {
              mouseOver: (e: any) => {
                this.setState({ hovered: e.target.name });
              },
              mouseOut: () => {
                this.setState({ hovered: null });
              }
            }
          },
          colors: shades
        }
      },
      credits: false,
      tooltip: { enabled: true, shadow: false },
      series: [
        // TODO: maybe try alternative approach to series data?
        // (see SeriesOption interface)
        {
          id: 'score',
          name: 'Score',
          data: keys(scores).map(label => {
            return [label, scores[label]];
          })
        }
      ]
    };

    // TODO: improve hover state, clean this up
    const getLegendColor = (name: string) => {
      return hovered === name ? colors.LIGHT_BROWN : colors.BLACK;
    };

    return (
      <div className="mood-score-chart-container" style={{ marginBottom: 16 }}>
        <div style={{ width: '40%', minWidth: 140 }}>
          <ReactHighcharts config={config} />
        </div>

        <div style={{}}>
          {keys(scores)
            .map((label, i) => {
              return { label, color: shades[i] };
            })
            .filter(({ label }) => scores[label] > 0)
            .map(({ label, color }, key) => {
              return (
                <AnalyticsChartLabel
                  key={key}
                  color={color}
                  textColor={getLegendColor(label)}
                  label={label}
                />
              );
            })}
        </div>
      </div>
    );
  }
}

export default MoodDistributionChart;

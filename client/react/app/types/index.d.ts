// TODO: create separate directories for modules if we end up having a bunch
declare module 'react-highcharts' {
  import * as React from 'react';
  // TODO: using lots of `any` types for now, could be better
  namespace ReactHighcharts {
    // TODO: see if the @types/highcharts library contains some of these
    interface Axis {
      type?: any;
      title?: {
        text?: string;
      };
      labels?: any;
    }

    interface SeriesOption {
      id?: string;
      name?: string;
      color?: string;
      data?: number[][] | {
        id?: string;
        name?: string;
        color?: string;
        x?: number;
        y?: number;
      }[];
    }

    interface Config {
      title?: {
        text?: string;
      };
      chart?: {
        height?: number;
        style: any;
      };
      plotOptions?: {
        series?: any;
        pie?: any;
      };
      tooltip?: any;
      xAxis?: Axis;
      yAxis?: Axis;
      credits?: boolean;
      series: SeriesOption[];
    }

    interface Props {
      config: Config;
    }
  }

  class ReactHighcharts extends React.Component<ReactHighcharts.Props> {}

  export = ReactHighcharts;
}

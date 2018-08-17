import * as React from 'react';
import * as moment from 'moment';
import { times, isNumber } from 'lodash';
import { MonthlyAverageStats, MonthlyAverage } from '../../helpers/reporting';

const mapMonthToAverage = (stats: MonthlyAverage[] = []) => {
  return stats.reduce((result, s) => {
    const { month, average } = s;

    return { ...result, [month]: average };
  }, {} as { [month: string]: number; });
};

const MonthlyAveragesTable = ({ stats }: { stats: MonthlyAverageStats }) => {
  const current = moment().month();
  const months = times(12, n => {
    const next = current - n;
    const m = next < 0 ? 12 + next : next;

    return moment().month(m).format('MMMM');
  }).reverse();
  const { productivity, depression, anxiety, wellbeing } = stats;
  const p = mapMonthToAverage(productivity);
  const d = mapMonthToAverage(depression);
  const a = mapMonthToAverage(anxiety);
  const w = mapMonthToAverage(wellbeing);
  const styles = {
    container: { marginTop: 16, marginBottom: 24 },
    cell: { fontSize: 12, width: '7%' },
  };

  return (
    <table className='dashboard-list-table' style={styles.container}>
      <thead>
        <tr>
          <th>Type</th>
          {
            months.map(month => {
              return (
                <th key={month} style={styles.cell}>{month.slice(0, 3)}</th>
              );
            })
          }
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className='text-blue'>Productivity</td>
          {
            months.map(month => {
              const score = p[month];

              return (
                <td key={month} style={styles.cell}>
                  {isNumber(score) ? score.toFixed(1) : '--'}
                </td>
              );
            })
          }
        </tr>
        <tr>
          <td className='text-blue'>Depression</td>
          {
            months.map(month => {
              const score = d[month];

              return (
                <td key={month} style={styles.cell}>
                  {isNumber(score) ? score.toFixed(1) : '--'}
                </td>
              );
            })
          }
        </tr>
        <tr>
          <td className='text-blue'>Anxiety</td>
          {
            months.map(month => {
              const score = a[month];

              return (
                <td key={month} style={styles.cell}>
                  {isNumber(score) ? score.toFixed(1) : '--'}
                </td>
              );
            })
          }
        </tr>
        <tr>
          <td className='text-blue'>Well-being</td>
          {
            months.map(month => {
              const score = w[month];

              return (
                <td key={month} style={styles.cell}>
                  {isNumber(score) ? score.toFixed(1) : '--'}
                </td>
              );
            })
          }
        </tr>
      </tbody>
    </table>
  );
};

export default MonthlyAveragesTable;

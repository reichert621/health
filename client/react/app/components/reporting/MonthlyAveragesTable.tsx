import * as React from 'react';
import * as moment from 'moment';
import { times, isNumber } from 'lodash';
import { MonthlyAverageStats, MonthlyAverage } from '../../helpers/reporting';

const styles = {
  container: { marginTop: 16, marginBottom: 24 },
  cell: { fontSize: 12, width: '7%' },
};

const getPastTwelveMonths = (today = moment()) => {
  const current = moment(today).month();

  return times(12, n => {
    const next = current - n;
    const m = next < 0 ? 12 + next : next;

    return moment().month(m).format('MMMM');
  }).reverse();
};

const mapMonthToAverage = (stats: MonthlyAverage[] = []) => {
  return stats.reduce((result, s) => {
    const { month, average } = s;

    return { ...result, [month]: average };
  }, {} as { [month: string]: number; });
};

interface RowProps {
  label: string;
  months: string[];
  averages: { [month: string]: number; };
}

const MonthlyAverageRow = ({ label, months, averages }: RowProps) => {
  return (
    <tr>
      <td className='text-blue'>{label}</td>
      {
        months.map(month => {
          const score = averages[month];

          return (
            <td key={month} style={styles.cell}>
              {isNumber(score) ? score.toFixed(1) : '--'}
            </td>
          );
        })
      }
    </tr>
  );
};

const MonthlyAveragesTable = ({ stats }: { stats: MonthlyAverageStats }) => {
  const months = getPastTwelveMonths();
  const { productivity, depression, anxiety, wellbeing } = stats;
  const p = mapMonthToAverage(productivity);
  const d = mapMonthToAverage(depression);
  const a = mapMonthToAverage(anxiety);
  const w = mapMonthToAverage(wellbeing);

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
        <MonthlyAverageRow
          label='Productivity'
          months={months}
          averages={p} />

        <MonthlyAverageRow
          label='Depression'
          months={months}
          averages={d} />

        <MonthlyAverageRow
          label='Anxiety'
          months={months}
          averages={a} />

        <MonthlyAverageRow
          label='Well-being'
          months={months}
          averages={w} />
      </tbody>
    </table>
  );
};

export default MonthlyAveragesTable;

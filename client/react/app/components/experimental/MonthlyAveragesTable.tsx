import * as React from 'react';
import * as moment from 'moment';
import { times } from 'lodash';
import { MonthlyAverageStats, MonthlyAverage } from '../../helpers/reporting';
import colors from '../../helpers/colors';
import MonthlyAverageRow from './MonthlyAverageRow';

const getPastMonths = (months = 12, today = moment()) => {
  const current = moment(today).month();

  return times(months, n => {
    const next = current - n;
    const m = next < 0 ? 12 + next : next;

    return moment()
      .month(m)
      .format('MMMM');
  }).reverse();
};

const mapMonthToAverage = (stats: MonthlyAverage[] = []) => {
  return stats.reduce(
    (result, s) => {
      const { month, average } = s;

      return { ...result, [month]: average };
    },
    {} as { [month: string]: number }
  );
};

const MonthlyAveragesTable = ({ stats }: { stats: MonthlyAverageStats }) => {
  const months = getPastMonths();
  const { productivity, depression, anxiety, wellbeing } = stats;
  const p = mapMonthToAverage(productivity);
  const d = mapMonthToAverage(depression);
  const a = mapMonthToAverage(anxiety);
  const w = mapMonthToAverage(wellbeing);
  const styles = {
    container: { paddingTop: 16, paddingBottom: 16 },
    table: { marginBottom: 0 },
    cell: { fontSize: 12, width: '7%' }
  };

  return (
    <div className="analytics-section-container" style={styles.container}>
      <table className="analytics-table" style={styles.table}>
        <thead>
          <tr>
            <th className="text-right">Type</th>
            {months.map(month => {
              return (
                <th key={month} style={styles.cell}>
                  {month.slice(0, 3)}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          <MonthlyAverageRow
            label="Productivity"
            months={months}
            averages={p}
            color={colors.ORANGE}
          />

          <MonthlyAverageRow
            label="Depression"
            months={months}
            averages={d}
            color={colors.BLACK}
          />

          <MonthlyAverageRow
            label="Anxiety"
            months={months}
            averages={a}
            color={colors.RED}
          />

          <MonthlyAverageRow
            label="Well-being"
            months={months}
            averages={w}
            color={colors.BLUE}
          />
        </tbody>
      </table>
    </div>
  );
};

export default MonthlyAveragesTable;

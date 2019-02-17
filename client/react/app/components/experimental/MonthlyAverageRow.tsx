import * as React from 'react';
import { isNumber } from 'lodash';
import colors from '../../helpers/colors';

interface MonthlyAverageRowProps {
  label: string;
  months: string[];
  averages: { [month: string]: number };
  color?: string;
}

const MonthlyAverageRow = ({
  label,
  months,
  averages,
  color
}: MonthlyAverageRowProps) => {
  const styles = {
    cell: { fontSize: 12, width: '7%', color: color || colors.BLACK }
  };

  return (
    <tr className="analytics-row">
      <td className="text-right">{label}</td>
      {months.map(month => {
        const score = averages[month];

        return (
          <td key={month} style={styles.cell}>
            {isNumber(score) ? score.toFixed(1) : '--'}
          </td>
        );
      })}
    </tr>
  );
};

export default MonthlyAverageRow;

import * as React from 'react';
import { keys, first, last } from 'lodash';
import {
  IAssessmentScoreFrequencies,
  IUniqueAssessmentScoreTask,
  IAssessmentTaskStats,
  IAssessmentQuestionStat
} from '../../helpers/assessment';

const calculateAverageFromFrequencies = (
  frequencies = {} as IAssessmentScoreFrequencies
): number => {
  const { n, d } = keys(frequencies).reduce(
    (total, key) => {
      const score = Number(key);
      const count = frequencies[key];

      return {
        n: total.n + score * count,
        d: total.d + count
      };
    },
    { n: 0, d: 0 }
  );

  // Divide by 4 since average score represents number from 1 - 4,
  // and we want to display this as a percentage (e.g. 1.2 -> 30%)
  return n / d / 4;
};

const generateSuggestedTasks = (
  stats: IAssessmentTaskStats,
  uniqs: IUniqueAssessmentScoreTask,
  direction: number
) => {
  const scores = keys(stats);

  if (scores.length < 2) return null;

  const best = direction > 0 ? last(scores) : first(scores);
  const all = stats[best];
  const top = uniqs[best]; // currently unused
  const key = direction > 0 ? 'prev' : 'next';

  return all
    .filter(item => {
      return item.deltas && item.deltas[key] > 0;
    })
    .map(item => {
      return { ...item, delta: item.deltas[key] };
    })
    .sort((x, y) => {
      const a = x.delta;
      const b = y.delta;

      return b - a;
    });
};

interface AssessmentReportingTableProps {
  stats: IAssessmentQuestionStat[];
  direction: number;
}

const AssessmentReportingTable = ({
  stats,
  direction
}: AssessmentReportingTableProps) => {
  const styles = {
    container: { marginTop: 24, marginBottom: 24 },
    cell: {
      lg: { width: '50%' },
      md: { width: '25%' },
      sm: { width: '15%' }
    }
  };

  return (
    <table className='dashboard-list-table' style={styles.container}>
      <thead>
        <tr>
          <th style={styles.cell.md}>Question</th>
          <th style={styles.cell.md}>Average</th>
          <th style={styles.cell.lg}>Suggestions</th>
        </tr>
      </thead>
      <tbody>
        {stats
          .map(stat => {
            const { question, frequencies, uniqs, stats: s } = stat;
            const { text } = question;
            const average = calculateAverageFromFrequencies(frequencies);
            const suggestions = generateSuggestedTasks(s, uniqs, direction);

            return {
              average,
              suggestions: suggestions ? suggestions.slice(0, 5) : [],
              question: text
            };
          })
          .sort((x, y) => direction * (x.average - y.average))
          .map((stat, key) => {
            const { average, question, suggestions } = stat;

            return (
              <tr key={key} className='dashboard-list-row'>
                <td style={styles.cell.md}>{question}</td>
                <td style={styles.cell.md}>{(average * 100).toFixed(2)}%</td>
                <td style={styles.cell.lg}>
                  {!suggestions || !suggestions.length ? 'N/A' : ''}
                  <ol>
                    {
                      suggestions.map((suggestion, key: number) => {
                        const { task, delta } = suggestion;

                        return (
                        <li key={key}>
                          {task} (+{(delta * 100).toFixed(2)}%)
                        </li>
                      );
                      })
                    }
                  </ol>
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};

export default AssessmentReportingTable;

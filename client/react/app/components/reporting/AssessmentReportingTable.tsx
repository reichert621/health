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

const getSuggestedUniqueTasks = (
  stats: IAssessmentTaskStats,
  uniqs: IUniqueAssessmentScoreTask,
  direction: number
) => {
  const scores = keys(uniqs);
  const best = direction > 0 ? last(scores) : first(scores);

  if (uniqs[best].length > 15) return null;

  const countsByTask = stats[best].reduce(
    (acc, { task, count }) => {
      return { ...acc, [task]: count };
    },
    {} as { [key: string]: number }
  );

  return uniqs[best]
    .filter(task => countsByTask[task] > 0)
    .map(task => {
      return { task, count: countsByTask[task] };
    })
    .sort((x, y) => y.count - x.count);
};

interface AssessmentReportingTableProps {
  title?: string;
  stats: IAssessmentQuestionStat[];
  direction: number;
}

const AssessmentReportingTable = ({
  title,
  stats,
  direction
}: AssessmentReportingTableProps) => {
  const styles = {
    container: { marginTop: 24, marginBottom: 24 },
    list: { paddingLeft: 16 },
    cell: {
      lg: { width: '35%' },
      md: { width: '20%' },
      sm: { width: '10%' }
    }
  };

  const sorted = stats
    .map(stat => {
      const { question, frequencies, uniqs, stats: s } = stat;
      const { text } = question;
      const average = calculateAverageFromFrequencies(frequencies);
      const suggestions = generateSuggestedTasks(s, uniqs, direction);
      const beta = getSuggestedUniqueTasks(s, uniqs, direction);

      return {
        average,
        suggestions: suggestions ? suggestions.slice(0, 5) : [],
        beta: beta ? beta.slice(0, 5) : [],
        question: text
      };
    })
    .sort((x, y) => direction * (x.average - y.average));

  // TODO: should more of this be handled on the server?
  const top = sorted.slice(0, 5).reduce(
    (counts, stat) => {
      const { suggestions, beta } = stat;
      const tasks = suggestions.map(s => s.task).concat(beta.map(b => b.task));

      return tasks.reduce((acc, task) => {
        return {
          ...acc,
          [task]: (acc[task] || 0) + 1
        };
      }, counts);
    },
    {} as { [key: string]: number }
  );

  const best = keys(top)
    .map(task => {
      return { task, count: top[task] };
    })
    .sort((x, y) => y.count - x.count);


  console.log(`Top tasks for ${title}:`, best.slice(0, 10));

  return (
    <table className='dashboard-list-table' style={styles.container}>
      <thead>
        <tr>
          <th style={styles.cell.md}>Question</th>
          <th style={styles.cell.sm}>Average</th>
          <th style={styles.cell.lg}>Suggestions</th>
          <th style={styles.cell.lg}>Unique to Top Score (beta)</th>
        </tr>
      </thead>
      <tbody>
        {sorted.map((stat, key) => {
          const { average, question, suggestions, beta } = stat;

          return (
            <tr key={key} className='dashboard-list-row'>
              <td style={styles.cell.md}>{question}</td>
              <td style={styles.cell.sm}>{(average * 100).toFixed(2)}%</td>
              <td style={styles.cell.lg}>
                {!suggestions || !suggestions.length ? 'N/A' : ''}
                <ol style={styles.list}>
                  {suggestions.map((suggestion, key: number) => {
                    const { task, delta } = suggestion;

                    return (
                      <li key={key}>
                        {task} (+
                        {(delta * 100).toFixed(2)}
                        %)
                      </li>
                    );
                  })}
                </ol>
              </td>
              <td style={styles.cell.lg}>
                {!beta || !beta.length ? 'N/A' : ''}
                <ol style={styles.list}>
                  {beta.map((suggestion, key: number) => {
                    const { task, count } = suggestion;

                    return (
                      <li key={key}>
                        {task} ({count} times)
                      </li>
                    );
                  })}
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

import * as React from 'react';
import { times } from 'lodash';
import { calculateAverage } from '../../helpers/utils';
import colors from '../../helpers/colors';

interface MoodTableProps {
  issues: {
    text: string;
    score: number;
  }[];
  suggestions: {
    label: string;
    tasks: {
      id: number;
      name: string;
      impact?: number;
    }[];
  };
}

const MoodSectionTable = ({ issues, suggestions }: MoodTableProps) => {
  const bgs = [colors.LIGHT_BEIGE, colors.BEIGE, colors.ORANGE];
  const { tasks } = suggestions;
  const combined = times(5, n => {
    const issue = issues[n];
    const task = tasks[n];

    if (!issue || !task) return null;

    const { name, impact } = task;
    const { text, score } = issue;

    return {
      issueName: text,
      issueScore: score * 100,
      taskName: name,
      taskImpact: impact
    };
  }).filter(Boolean);

  const scores = combined.map(({ issueScore }) => issueScore);
  const impacts = combined.map(({ taskImpact }) => taskImpact);
  const averageScore = calculateAverage(scores);
  const averageImpact = calculateAverage(impacts);

  const getBgColor = (diff: number) => {
    if (diff < -1) {
      return colors.ORANGE;
    } else if (diff > 1) {
      return colors.LIGHT_BEIGE;
    } else {
      return colors.BEIGE;
    }
  };

  const styles = {
    text: { width: '35%' },
    num: { width: '15%' },
    score: (n?: number) => {
      if (!n) return styles.num;

      const diff = Math.abs(averageScore) - Math.abs(n);

      return {
        ...styles.num,
        backgroundColor: n ? getBgColor(diff) : null // FIXME
      };
    },
    impact: (n?: number) => {
      if (!n) return styles.num;

      const diff = Math.abs(averageImpact) - Math.abs(n);

      return {
        ...styles.num,
        backgroundColor: n ? getBgColor(diff) : null
      };
    }
  };

  return (
    <table className="analytics-table" style={{ marginBottom: 0 }}>
      <thead>
        <tr>
          <th className="text-left" style={styles.text}>
            Top Issues
          </th>
          <th style={styles.num}>Score</th>
          <th className="text-left" style={styles.text}>
            Top Suggestions
          </th>
          <th style={styles.num}>Impact</th>
        </tr>
      </thead>
      <tbody>
        {combined.map((data, key) => {
          const { issueName, issueScore, taskName, taskImpact } = data;

          return (
            <tr key={key}>
              <td className="text-left" style={styles.text}>
                {issueName}
              </td>
              <td className="-text-heavy" style={styles.score(issueScore)}>
                {(issueScore || 0).toFixed(1)}%
              </td>
              <td className="text-left" style={styles.text}>
                {taskName}
              </td>
              <td className="-text-heavy" style={styles.impact(taskImpact)}>
                {(taskImpact || 0).toFixed(1)}%
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default MoodSectionTable;

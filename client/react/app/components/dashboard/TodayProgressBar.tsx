import * as React from 'react';

const colors: { [n: string]: string } = {
  xs: '#B8DBE9',
  sm: '#8BC9E1',
  md: '#72BFDB',
  lg: '#4FAED1',
  xl: '#33A2CC',
  inactive: '#D2D2D2'
};

const getWidth = (n: number, d: number): string => {
  const width = Math.floor((n / d) * 100);

  return `${width}%`;
};

const getColor = (current: number, average: number, high: number) => {
  if (current < average) return colors.sm;
  if (current < high) return colors.md;

  return colors.lg;
};

interface ProgressBarProps {
  currentScore: number;
  averageScore: number;
  topScore: number;
}

const ProgressBar = ({
  currentScore,
  averageScore,
  topScore
}: ProgressBarProps) => {
  const minScore = 1;
  const maxScore = (currentScore > topScore ? currentScore : topScore) + 8;
  const width = Math.floor((currentScore / maxScore) * 100);

  return (
    <div>
      <div className='progress-bar-labels-container'>
        <span
          className={`progress-bar-label ${
            currentScore > minScore ? 'active' : 'inactive'
          } ${averageScore ? '' : 'hidden'}`}
          style={{
            left: getWidth(minScore, maxScore)
          }}>
          minimum
        </span>
        <span
          className={`progress-bar-label ${
            currentScore > averageScore ? 'active' : 'inactive'
          } ${averageScore ? '' : 'hidden'}`}
          style={{
            left: getWidth(averageScore, maxScore)
          }}>
          average
        </span>
        <span
          className={`progress-bar-label ${
            currentScore > topScore ? 'active' : 'inactive'
            } ${topScore ? '' : 'hidden'}`}
          style={{
            left: getWidth(topScore, maxScore)
          }}>
          high
        </span>
      </div>

      <div className='daily-progress-bar-container'>
        <div
          className='daily-progress-bar'
          style={{
            backgroundColor: getColor(currentScore, averageScore, topScore),
            width: getWidth(currentScore, maxScore)
          }}>
        </div>
      </div>

      <div className='progress-bar-labels-container'>
        <span
          className={`progress-bar-label active`}
          style={{
            left: getWidth(currentScore, maxScore),
            borderLeft: 'none'
          }}>
          today - {currentScore} points
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;

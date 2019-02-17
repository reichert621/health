import * as React from 'react';
import styled from 'styled-components';
import { Color } from './Common';

interface MoodScoreCellProps {
  delta?: number;
}

const MoodScoreCell = styled.div`
  padding: 4px 8px;
  text-align: right;
  flex: 1;
  color: ${(props: MoodScoreCellProps) => {
    if (!Number.isFinite(props.delta)) return null;

    return props.delta < 0 ? Color.RED : Color.BLUE;
  }};
  font-weight: ${(props: MoodScoreCellProps) => (props.delta ? '500' : null)}};

  &:last-child {
    border-right: none;
  }
`;

const MoodScoreLabel = styled(MoodScoreCell)`
  color: ${Color.LIGHT_BROWN};
  font-weight: 500;
  font-size: 12px;
  padding-top: 6px;
`;

// TODO: prop types
const ActivityMoodScores = ({ scores }: { scores: any }) => {
  const { depression, anxiety, wellbeing } = scores;

  // TODO
  return (
    <div>
      <div className="activity-details-label">Average Scores</div>

      <div className="activity-mood-scores-container">
        <div className="activity-mood-score-row">
          <MoodScoreCell>&nbsp;</MoodScoreCell>
          <MoodScoreLabel>With</MoodScoreLabel>
          <MoodScoreLabel>Without</MoodScoreLabel>
          <MoodScoreLabel>Delta</MoodScoreLabel>
        </div>

        <div className="activity-mood-score-row">
          <MoodScoreLabel>Depression</MoodScoreLabel>
          <MoodScoreCell>
            {(depression.included || 0).toFixed(1)}%
          </MoodScoreCell>
          <MoodScoreCell>
            {(depression.excluded || 0).toFixed(1)}%
          </MoodScoreCell>
          <MoodScoreCell delta={depression.delta}>
            {depression.delta < 0 ? '-' : '+'}
            {Math.abs(depression.delta).toFixed(1)}%
          </MoodScoreCell>
        </div>

        <div className="activity-mood-score-row">
          <MoodScoreLabel>Anxiety</MoodScoreLabel>
          <MoodScoreCell>{(anxiety.included || 0).toFixed(1)}%</MoodScoreCell>
          <MoodScoreCell>{(anxiety.excluded || 0).toFixed(1)}%</MoodScoreCell>

          <MoodScoreCell delta={anxiety.delta}>
            {anxiety.delta < 0 ? '-' : '+'}
            {Math.abs(anxiety.delta).toFixed(1)}%
          </MoodScoreCell>
        </div>

        <div className="activity-mood-score-row">
          <MoodScoreLabel>Well-being</MoodScoreLabel>
          <MoodScoreCell>{(wellbeing.included || 0).toFixed(1)}%</MoodScoreCell>
          <MoodScoreCell>{(wellbeing.excluded || 0).toFixed(1)}%</MoodScoreCell>
          <MoodScoreCell delta={wellbeing.delta}>
            {wellbeing.delta < 0 ? '-' : '+'}
            {Math.abs(wellbeing.delta).toFixed(1)}%
          </MoodScoreCell>
        </div>
      </div>
    </div>
  );
};

export default ActivityMoodScores;

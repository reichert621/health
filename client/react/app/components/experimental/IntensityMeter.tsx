import * as React from 'react';

const IntensityMeter = ({ points }: { points: number }) => {
  const mappings: { [points: string]: string } = {
    1: 'Very Low',
    2: 'Low',
    4: 'High',
    8: 'Very High'
  };

  const intensity = mappings[points] || 'Very Low';

  return (
    <div style={{ marginBottom: 32 }}>
      <div className="activity-details-label">
        <span>Intensity &mdash; </span>
        <span className="text-heavy">{intensity}</span>
      </div>

      <div className="activity-intensity-bar">
        <div className={`intensity-section ${points > 0 ? 'very-low' : ''}`} />
        <div className={`intensity-section ${points > 1 ? 'low' : ''}`} />
        <div className={`intensity-section ${points > 2 ? 'high' : ''}`} />
        <div className={`intensity-section ${points > 4 ? 'very-high' : ''}`} />
      </div>
    </div>
  );
};

export default IntensityMeter;

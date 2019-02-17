import * as React from 'react';
import colors from '../../helpers/colors';

interface SectionAverageProps {
  averages: {
    today?: number;
    thisWeek?: number;
    thisMonth?: number;
    lastWeek?: number;
    lastMonth?: number;
  };
}

// TODO: figure out how to make this look nicer
const SectionAverages = ({ averages }: SectionAverageProps) => {
  const {
    today = 0,
    thisWeek = 0,
    lastWeek = 0,
    thisMonth = 0,
    lastMonth = 0
  } = averages;

  return (
    <div style={{ marginTop: 16, marginLeft: 16 }}>
      <div style={{ display: 'flex' }}>
        {/* TODO: use bar graph to denote scores? */}
        <div style={{ width: '40%' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="vertical-bar-container">
              <div
                className="vertical-bar"
                style={{ height: `${today.toFixed(3)}%` }}
              />
            </div>

            {/* TODO: use overall average score for analytics (not today's) */}
            <div style={{ fontSize: 54, fontWeight: 500 }}>
              <span>{(today || 0).toFixed(0)}</span>
              <span style={{ fontSize: 32 }}>%</span>
            </div>
          </div>

          <div style={{ fontSize: 10, color: '#B88C5A' }}>overall average</div>
        </div>

        <div
          style={{
            width: '30%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ marginBottom: 8, marginTop: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>
              {(thisWeek || 0).toFixed(2)}%
            </div>
            <div style={{ fontSize: 10, color: '#B88C5A' }}>this week</div>
          </div>

          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>
              {(thisMonth || 0).toFixed(2)}%
            </div>
            <div style={{ fontSize: 10, color: '#B88C5A' }}>this month</div>
          </div>
        </div>

        <div
          style={{
            width: '30%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ marginBottom: 8, marginTop: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>
              <span style={{ color: colors.DARK_GREEN, fontWeight: 900 }}>
                {thisWeek >= lastWeek ? '+' : '-'}
              </span>
              <span>{Math.abs(thisWeek - lastWeek).toFixed(2)}%</span>
            </div>
            <div style={{ fontSize: 10, color: '#B88C5A' }}>from last week</div>
          </div>

          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>
              <span style={{ color: colors.DARK_GREEN, fontWeight: 900 }}>
                {thisMonth >= lastMonth ? '+' : '-'}
              </span>
              <span>{Math.abs(thisMonth - lastMonth).toFixed(2)}%</span>
            </div>
            <div style={{ fontSize: 10, color: '#B88C5A' }}>
              from last month
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionAverages;

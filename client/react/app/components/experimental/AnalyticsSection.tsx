import * as React from 'react';
import MoodDistributionChart from './MoodDistributionChart';
import SectionAverages from './SectionAverages';
import MoodSectionTable from './MoodSectionTable';

interface AnalyticsSectionProps {
  title: string;
  moodDistribution: {
    [label: string]: number;
  };
  averages: {
    today?: number;
    thisWeek?: number;
    thisMonth?: number;
    lastWeek?: number;
    lastMonth?: number;
  };
  topIssues: {
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

const AnalyticsSection = ({
  title,
  moodDistribution,
  averages,
  topIssues,
  suggestions
}: AnalyticsSectionProps) => {
  return (
    <section>
      <h2 style={{ marginBottom: 16 }}>{title}</h2>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div
          className="analytics-section-container"
          style={{ flex: 1, maxWidth: 360, marginRight: 16 }}
        >
          <MoodDistributionChart
            scores={moodDistribution}
            label={title.toLowerCase()}
          />

          <SectionAverages averages={averages} />
        </div>

        <div
          className="analytics-section-container"
          style={{
            display: 'flex',
            flex: 2,
            paddingTop: 16,
            paddingBottom: 16
          }}
        >
          <MoodSectionTable issues={topIssues} suggestions={suggestions} />
        </div>
      </div>
    </section>
  );
};

export default AnalyticsSection;

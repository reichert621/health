import * as reporting from '../reporting';

describe('reporting', () => {
  describe('getTotalStreak', () => {
    it('gets the intersection of two streaks', () => {
      const checklists = [
        { date: '2017-01-30', count: 1 },
        { date: '2017-01-29', count: 1 },
        { date: '2017-01-28', count: 1 },
        { date: '2017-01-27', count: 1 }
      ];
      const scorecards = [
        { date: '2017-01-30', count: 1 },
        { date: '2017-01-28', count: 1 },
        { date: '2017-01-27', count: 1 }
      ];
      const streak = reporting.getTotalStreak(checklists, scorecards);

      expect(streak).toEqual([1, 2]);
    });

    it('handles a single streak', () => {
      const checklists = [
        { date: '2017-01-30', count: 1 },
        { date: '2017-01-29', count: 1 },
        { date: '2017-01-28', count: 1 },
        { date: '2017-01-27', count: 1 }
      ];
      const scorecards = [
        { date: '2017-01-30', count: 1 },
        { date: '2017-01-29', count: 1 },
        { date: '2017-01-28', count: 1 },
        { date: '2017-01-27', count: 1 }
      ];
      const streak = reporting.getTotalStreak(checklists, scorecards);

      expect(streak).toEqual([4]);
    });

    it('handles no streak', () => {
      const checklists = [
        { date: '2017-01-30', count: 1 },
        { date: '2017-01-29', count: 1 },
        { date: '2017-01-28', count: 1 },
        { date: '2017-01-27', count: 1 }
      ];
      const scorecards: reporting.ReportingDatedItem[] = [];
      const streak = reporting.getTotalStreak(checklists, scorecards);

      expect(streak).toEqual([]);
    });
  });

  describe('calculateEarnings', () => {
    it('returns zero for no streaks', () => {
      const streaks: number[] = [];

      expect(reporting.calculateEarnings(streaks)).toBe(0);
    });

    it('calculates earnings for a five-day streak', () => {
      const streaks = [5];

      expect(reporting.calculateEarnings(streaks)).toBe(500);
    });

    it('calculates earnings for a week-long streak', () => {
      const streaks = [7];

      expect(reporting.calculateEarnings(streaks)).toBe(1000);
    });

    it('calculates earnings for a month-long streak', () => {
      const streaks = [30];

      expect(reporting.calculateEarnings(streaks)).toBe(6200);
    });

    it('calculates earnings for a three month-long streak', () => {
      const streaks = [90];

      expect(reporting.calculateEarnings(streaks)).toBe(22600);
    });

    it('calculates earnings for a six month-long streak', () => {
      const streaks = [180];

      expect(reporting.calculateEarnings(streaks)).toBe(49500);
    });

    it('calculates earnings for a year-long streak', () => {
      const streaks = [365];

      expect(reporting.calculateEarnings(streaks)).toBe(100000);
    });

    it('calculates earnings for multiple streaks', () => {
      const streaks = [5, 7, 1, 30];
      const expected = 500 + 1000 + 100 + 6200;

      expect(reporting.calculateEarnings(streaks)).toBe(expected);
    });
  });

  describe('mergeTaskStats', () => {
    it('merges two sets of task stats into one', () => {
      const topTasks: reporting.ReportingTask[] = [
        { task: 'Exercise', count: 3, points: 4 },
        { task: 'Read', count: 4, points: 2 },
        { task: 'Write', count: 2, points: 8 }
      ];

      const depressionScoresByTask: reporting.TaskImpactStats[] = [
        { task: 'Exercise', data: { average: 1 } },
        { task: 'Read', data: { average: 3 } },
        { task: 'Write', data: { average: 2 } }
      ];

      const anxietyScoresByTask: reporting.TaskImpactStats[] = [
        { task: 'Exercise', data: { average: 4 } },
        { task: 'Read', data: { average: 7 } },
        { task: 'Write', data: { average: 3 } }
      ];

      const wellnessScoresByTask: reporting.TaskImpactStats[] = [
        { task: 'Exercise', data: { average: 60 } },
        { task: 'Read', data: { average: 58 } },
        { task: 'Write', data: { average: 66 } }
      ];

      const actual = reporting.mergeTaskStats(topTasks, {
        depressionScoresByTask,
        anxietyScoresByTask,
        wellnessScoresByTask
      });

      const expected: reporting.ReportingTask[] = [
        {
          task: 'Exercise',
          count: 3,
          points: 12,
          depression: 1,
          anxiety: 4,
          wellness: 75,
          happiness: 90
        },
        {
          task: 'Read',
          count: 4,
          points: 8,
          depression: 3,
          anxiety: 7,
          wellness: 72.5,
          happiness: 87.5
        },
        {
          task: 'Write',
          count: 2,
          points: 16,
          depression: 2,
          anxiety: 3,
          wellness: 82.5,
          happiness: 92.5
        }
      ];

      expect(actual).toEqual(expected);
    });

    it('handles empty stats', () => {
      const actual = reporting.mergeTaskStats([], {
        depressionScoresByTask: [],
        anxietyScoresByTask: [],
        wellnessScoresByTask: []
      });

      const expected: reporting.ReportingTask[] = [];

      expect(actual).toEqual(expected);
    });
  });
});

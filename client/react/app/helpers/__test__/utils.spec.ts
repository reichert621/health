import * as moment from 'moment';
import * as utils from '../utils';

describe('utils', () => {
  describe('DAYS_OF_WEEK', () => {
    it('has all 7 days', () => {
      expect(utils.DAYS_OF_WEEK.length).toBe(7);
    });
  });

  describe('pluralize', () => {
    it('returns the plural form by default', () => {
      expect(utils.pluralize('dog')).toBe('dogs');
      expect(utils.pluralize('cat')).toBe('cats');
      expect(utils.pluralize('program')).toBe('programs');
      expect(utils.pluralize('day')).toBe('days');
      expect(utils.pluralize('point')).toBe('points');
    });

    it('returns the plural or singular form based on the given number', () => {
      expect(utils.pluralize('dog', 2)).toBe('dogs');
      expect(utils.pluralize('cat', 1)).toBe('cat');
      expect(utils.pluralize('program', 10)).toBe('programs');
      expect(utils.pluralize('day', 1)).toBe('day');
      expect(utils.pluralize('point', 0)).toBe('points');
    });

    it('uses the custom plural form when provided', () => {
      expect(utils.pluralize('person', 2, 'people')).toBe('people');
      expect(utils.pluralize('person', 1, 'people')).toBe('person');
    });
  });

  describe('getFormattedPercentage', () => {
    it('gets the percentage of x relative to y', () => {
      expect(utils.getFormattedPercentage(10, 100)).toBe('10.0');
      expect(utils.getFormattedPercentage(2, 5)).toBe('40.0');
      expect(utils.getFormattedPercentage(3, 4)).toBe('75.0');
      expect(utils.getFormattedPercentage(1, 3)).toBe('33.3');
      expect(utils.getFormattedPercentage(2, 7)).toBe('28.6');
    });

    it('returns zero if the denominator is zero', () => {
      expect(utils.getFormattedPercentage(10, 0)).toBe('0.0');
      expect(utils.getFormattedPercentage(2, 0)).toBe('0.0');
      expect(utils.getFormattedPercentage(3, 0)).toBe('0.0');
      expect(utils.getFormattedPercentage(1, 0)).toBe('0.0');
      expect(utils.getFormattedPercentage(2, 0)).toBe('0.0');
    });
  });

  describe('keyifyDate', () => {
    it('creates a consistent key string regardless of date format', () => {
      expect(utils.keyifyDate('2017-01-01')).toBe('01012017');
      expect(utils.keyifyDate(new Date(2017, 0, 1))).toBe('01012017');
      expect(utils.keyifyDate(moment('2017-01-01'))).toBe('01012017');
    });
  });

  describe('mapByDate', () => {
    const items = [
      { id: 1, date: '2017-01-01' },
      { id: 2, date: '2017-02-01' },
      { id: 3, date: '2017-03-01' }
    ];

    it('maps items by their respective dates', () => {
      const mappings = utils.mapByDate(items);
      const expected = {
        '01012017': { id: 1, date: '2017-01-01' },
        '02012017': { id: 2, date: '2017-02-01' },
        '03012017': { id: 3, date: '2017-03-01' }
      };

      expect(mappings).toEqual(expected);
    });
  });

  describe('mapById', () => {
    const items = [
      { id: 1, date: '2017-01-01' },
      { id: 2, date: '2017-02-01' },
      { id: 3, date: '2017-03-01' }
    ];

    it('maps items by their respective ids', () => {
      const mappings = utils.mapById(items);
      const expected = {
        '1': { id: 1, date: '2017-01-01' },
        '2': { id: 2, date: '2017-02-01' },
        '3': { id: 3, date: '2017-03-01' }
      };

      expect(mappings).toEqual(expected);
    });
  });

  // TODO: figure out the best way to mock `moment`
  describe('getPastDates', () => {
    it('gets the past 10 days by default', () => {
      const dates = utils.getPastDates();

      expect(dates.length).toBe(10);
    });

    it('gets the past n days if specifed', () => {
      const dates = utils.getPastDates(30);

      expect(dates.length).toBe(30);
    });
  });

  describe('getStreakStats', () => {
    it('handles no streaks', () => {
      const items = [
        { date: '2017-01-11' },
        { date: '2017-01-09' },
        { date: '2017-01-07' },
        { date: '2017-01-05' }
      ];

      const actual = utils.getStreakStats(items);
      const expected = [1, 1, 1, 1];

      expect(actual).toEqual(expected);
    });

    it('handles a single streak', () => {
      const items = [
        { date: '2017-01-10' },
        { date: '2017-01-09' },
        { date: '2017-01-08' },
        { date: '2017-01-07' },
        { date: '2017-01-06' }
      ];

      const actual = utils.getStreakStats(items);
      const expected = [5];

      expect(actual).toEqual(expected);
    });

    it('handles multiple streaks', () => {
      const items = [
        { date: '2017-01-11' },
        { date: '2017-01-09' },
        { date: '2017-01-08' },
        { date: '2017-01-07' },
        { date: '2017-01-05' },
        { date: '2017-01-04' }
      ];

      const actual = utils.getStreakStats(items);
      const expected = [1, 3, 2];

      expect(actual).toEqual(expected);
    });
  });
});

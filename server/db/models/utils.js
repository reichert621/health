const moment = require('moment');
const { first, last, times, includes } = require('lodash');

const DATE_FORMAT = 'YYYY-MM-DD';

const AssessmentTypes = {
  DEPRESSION: 'depression',
  ANXIETY: 'anxiety',
  WELL_BEING: 'wellbeing'
};

const isValidDateFormat = (str) => {
  return moment(str, DATE_FORMAT, true).isValid();
};

const includesDateInDates = (date, dates = []) => {
  return dates.some(d => moment(d).isSame(date));
};

const calculateAverage = (nums = []) => {
  if (!nums || !nums.length) return 0;

  const sum = nums.reduce((total, n) => total + n, 0);
  const count = nums.length;

  return sum / count;
};

const getDateRange = (dates = []) => {
  const sorted = dates.sort((x, y) => Number(x) - Number(y));

  return [first(sorted), last(sorted)];
};

const getDaysBetween = (start, end) => {
  const diff = moment(end).diff(start, 'days');

  return times(diff).map(n => {
    return moment(start).add(n, 'days');
  });
};

const formatBetweenFilter = (dates = {}) => {
  const {
    startDate = -Infinity,
    endDate = Infinity
  } = dates;

  return [startDate, endDate];
};

const getCombinations = (arr) => {
  if (arr.length === 1) return [arr];

  const [head, ...rest] = arr;
  const perms = getCombinations(rest);

  return [
    [head],
    ...perms,
    ...perms.map(p => [head].concat(p))
  ];
};

const isValidAssessmentType = (type) => {
  if (!type || !type.length) return false;

  const types = Object.values(AssessmentTypes);

  return includes(types, type);
};

const getPairs = (arr = []) => {
  let pairs = [];

  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      pairs.push([arr[i], arr[j]]);
    }
  }

  return pairs;
};

const square = (n) => n * n;

// TODO: rename args
const calculateCorrelationCoefficient = (prefs, p1, p2) => {
  const set1 = prefs[p1];
  const set2 = prefs[p2];

  if (!set1 || !set2) return 0;

  const shared = prefs[p1].reduce((acc, n, index) => {
    if (prefs[p2][index]) {
      return acc.concat(index);
    } else {
      return acc;
    }
  }, []);

  if (shared.length === 0) return 0;

  const len = shared.length;
  const sum1 = shared.reduce((total, n) => total + prefs[p1][n], 0);
  const sum2 = shared.reduce((total, n) => total + prefs[p2][n], 0);
  const sum1Sq = shared.reduce((total, n) => total + square(prefs[p1][n]), 0);
  const sum2Sq = shared.reduce((total, n) => total + square(prefs[p2][n]), 0);
  const pSum = shared.reduce((total, n) => {
    return total + (prefs[p1][n] * prefs[p2][n]);
  }, 0);

  const numerator = pSum - ((sum1 * sum2) / len);
  const denominator = Math.sqrt(
    (sum1Sq - (square(sum1) / len)) * (sum2Sq - (square(sum2) / len))
  );

  return denominator === 0 ? 0 : (numerator / denominator);
};


module.exports = {
  DATE_FORMAT,
  AssessmentTypes,
  isValidDateFormat,
  includesDateInDates,
  calculateAverage,
  getDateRange,
  getDaysBetween,
  formatBetweenFilter,
  getCombinations,
  isValidAssessmentType,
  getPairs,
  calculateCorrelationCoefficient
};

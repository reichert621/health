const moment = require('moment');
const { first, last, times } = require('lodash');

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

module.exports = {
  calculateAverage,
  getDateRange,
  getDaysBetween,
  getCombinations
};

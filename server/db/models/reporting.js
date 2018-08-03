const moment = require('moment');
const {
  DATE_FORMAT,
  getPairs,
  calculateCorrelationCoefficient
} = require('./utils');

const scoreTypes = {
  PRODUCTIVITY: 'productivity',
  DEPRESSION: 'depression',
  ANXIETY: 'anxiety',
  WELL_BEING: 'wellbeing'
};

const mapScoresByDate = (scores = []) => {
  return scores.reduce((acc, set) => {
    const { type, stats } = set;

    return stats.reduce((current, item) => {
      const [ts, n] = item;
      const key = moment(ts).format(DATE_FORMAT);
      const obj = current[key] || {};

      return { ...current, [key]: { ...obj, [type]: n } };
    }, acc);
  }, {});
};

const generateDatasetsByScoreType = (scoresByDate = {}) => {
  return Object.keys(scoresByDate).reduce((result, date) => {
    const sets = scoresByDate[date];

    return Object.values(scoreTypes).reduce((acc, type) => {
      return {
        ...acc,
        [type]: (acc[type] || []).concat(sets[type] || null)
      };
    }, result);
  }, {});
};

const calculateCoefficientStats = ({
  scorecardStats = [],
  anxietyStats = [],
  depressionStats = [],
  wellBeingStats = []
}) => {
  const scoresByDate = mapScoresByDate([
    { type: scoreTypes.PRODUCTIVITY, stats: scorecardStats },
    { type: scoreTypes.ANXIETY, stats: anxietyStats },
    { type: scoreTypes.DEPRESSION, stats: depressionStats },
    { type: scoreTypes.WELL_BEING, stats: wellBeingStats }
  ]);
  const datasets = generateDatasetsByScoreType(scoresByDate);
  const labels = Object.values(scoreTypes);
  const pairs = getPairs(labels);
  const coefficients = pairs.reduce((acc, pair) => {
    const key = pair.join(':');

    return {
      ...acc,
      [key]: calculateCorrelationCoefficient(datasets, ...pair)
    };
  }, {});

  return { labels, coefficients };
};

module.exports = {
  calculateCoefficientStats
};

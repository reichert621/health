// TODO: use middleware for better error handling
const handleError = (res, err) => {
  console.error('An error occurred!', err);

  return res
    .status(500)
    .send({ status: 500, error: err.message });
};

module.exports = {
  handleError
};

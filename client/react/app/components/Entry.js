import React, { PropTypes } from 'react';

const Entry = ({ entry }) => {
  return (
    <li>
      <div>{entry.content}</div>
      <small>Author: {entry.author}</small>
    </li>
  );
};

Entry.propTypes = {
  entry: PropTypes.object.isRequired
};

export default Entry;

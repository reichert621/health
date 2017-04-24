import React, { PropTypes } from 'react';

const Entry = ({ entry }) => {
  return (
    <div className="entry-container">
      <h2 className="entry-title">
        {entry.title}
      </h2>

      <div className="entry-content">
        {entry.content}
      </div>

      <small>
        {entry.created_at}
      </small>

      <div>
        <a href="#">
          View
        </a>
      </div>
    </div>
  );
};

Entry.propTypes = {
  entry: PropTypes.object.isRequired
};

export default Entry;

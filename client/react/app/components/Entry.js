import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';

const Entry = ({ entry, isPreview }) => {
  // Quick fix for link, a bit hacky
  const link = isPreview ?
    <Link to={`/entry/${entry.id}`}>View</Link> :
    <Link to="/">Back</Link>;

  return (
    <div className="entry-container">
      <h2 className="entry-title">
        {entry.title}
      </h2>

      <div className="entry-content">
        {entry.content}
      </div>

      <small>{entry.created_at}</small>
      <div>{link}</div>
    </div>
  );
};

Entry.propTypes = {
  entry: PropTypes.object.isRequired
};

export default Entry;

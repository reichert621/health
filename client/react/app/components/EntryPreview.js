import React, { PropTypes } from 'react';
import { first } from 'lodash';
import { Link } from 'react-router-dom';
import './Entry.less';

const getPreviewContent = (content = '') =>
  first(content.split('\n'));

const EntryPreview = ({ entry }) => {
  const { id, title, content, created_at } = entry;

  return (
    <div className="entry-container">
      <h2 className="entry-title">
        {title}
      </h2>

      <div className="entry-content">
        {content ? getPreviewContent(content) : ''}
      </div>

      <small>{created_at}</small>
      <div>
        <Link to={`/entry/${id}`}>View</Link>
      </div>
    </div>
  );
};

EntryPreview.propTypes = {
  entry: PropTypes.object.isRequired
};

export default EntryPreview;

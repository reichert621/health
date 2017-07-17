import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import md from '../helpers/markdown';
import './Entry.less';

const formatHTML = (content = '') => {
  return { __html: md(content) };
};

const Entry = ({ entry }) => {
  const { title, content, created_at } = entry;

  return (
    <div className="entry-container">
      <h2 className="entry-title">
        {title}
      </h2>

      <div className="entry-content"
        dangerouslySetInnerHTML={formatHTML(content)}>
      </div>

      <small>{created_at}</small>
      <div>
        <Link to="/">Back</Link>
      </div>
    </div>
  );
};

Entry.propTypes = {
  entry: PropTypes.object.isRequired
};

export default Entry;

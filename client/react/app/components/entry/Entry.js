import React from 'react';
import md from '../../helpers/markdown';
import './Entry.less';

const formatHTML = (content = '') => {
  return { __html: md(content) };
};

// TODO: figure out how to render entries differently
// for public vs. private vs. vs. preview vs. editing
const Entry = ({ entry }) => {
  const { title, content, isPrivate } = entry;

  return (
    <div className="entry-container">
      <h2 className="entry-title">
        {title}
      </h2>

      <div className="entry-content"
        dangerouslySetInnerHTML={formatHTML(content)}>
      </div>

      <small>
        {isPrivate ? 'Private' : 'Public'}
      </small>
    </div>
  );
};

export default Entry;

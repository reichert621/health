import React, { PropTypes } from 'react';
import { first } from 'lodash';
import { Link } from 'react-router-dom';
import './Entry.less';

const getPreviewContent = (content = '') => {
  return first(content.split('\n'));
};

const EntryPreview = ({ entry }) => {
  const { id, content, date } = entry;

  return (
    <div className='entry-preview-container'>
      <h3 className='text-light'>
        {date.format('dddd MMMM DD, YYYY')}
      </h3>

      <div className='entry-content'>
        {content ? getPreviewContent(content) : ''}
      </div>

      <div className='entry-view-link-container'>
        <Link to={`/entry/${id}`}>
          <span>View</span>
          <img className='forward-icon' src='assets/back-arrow.svg' />
        </Link>
      </div>
    </div>
  );
};

EntryPreview.propTypes = {
  entry: PropTypes.object.isRequired
};

export default EntryPreview;

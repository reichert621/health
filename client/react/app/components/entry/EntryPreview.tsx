import * as React from 'react';
import * as moment from 'moment';
import { first } from 'lodash';
import { Link } from 'react-router-dom';
import './Entry.less';

interface IEntryPreview {
  content: string;
  date: moment.Moment;
}

const getPreviewContent = (content = '') => {
  return first(content.split('\n'));
};

interface EntryPreviewProps {
  entry: IEntryPreview;
  linkTo: string;
}

const EntryPreview = ({ entry, linkTo }: EntryPreviewProps) => {
  const { content, date } = entry;

  return (
    <div className='entry-preview-container'>
      <h3 className='text-light'>
        {date.format('dddd MMMM DD, YYYY')}
      </h3>

      <div className='entry-content'>
        {content ? getPreviewContent(content) : ''}
      </div>

      <div className='entry-view-link-container'>
        <Link to={linkTo}>
          <span>View</span>
          <img className='forward-icon' src='assets/back-arrow.svg' />
        </Link>
      </div>
    </div>
  );
};

export default EntryPreview;

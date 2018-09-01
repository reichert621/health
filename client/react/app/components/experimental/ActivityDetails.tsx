import * as React from 'react';
import { times, sample } from 'lodash';

const IntensityMeter = () => {
  return (
    <div>
      <div className='activity-details-label'>
        <span>Intensity &mdash; </span>
        <span className='text-heavy'>High</span>
      </div>

      <div className='activity-intensity-bar'>
        <div className='intensity-section very-low'></div>
        <div className='intensity-section low'></div>
        <div className='intensity-section high'></div>
        <div className='intensity-section'></div>
      </div>
    </div>
  );
};

const HeatMap = () => {
  const colors = ['#fff', '#FBF6F0', '#F4E6DB', '#E6AF70', '#B88C5A'];
  const style = () => ({ backgroundColor: sample(colors) });

  return (
    <div>
      <div className='activity-labels-container'>
        <div className='activity-details-label'>
          <span>Streak &mdash; </span>
          <span className='text-heavy'>5 days</span>
        </div>

        <div className='activity-details-label'>
          <span>Total Completed &mdash; </span>
          <span className='text-heavy'>42 days</span>
        </div>
      </div>

      <div className='heat-map-container'>
        <div className='heat-row'>
          {times(30, n => <div className='heat-box' style={style()}></div>)}
        </div>
        <div className='heat-row'>
          {times(30, n => <div className='heat-box' style={style()}></div>)}
        </div>
        <div className='heat-row'>
          {times(30, n => <div className='heat-box' style={style()}></div>)}
        </div>
        <div className='heat-row'>
          {times(30, n => <div className='heat-box' style={style()}></div>)}
        </div>
        <div className='heat-row'>
          {times(30, n => <div className='heat-box' style={style()}></div>)}
        </div>
        <div className='heat-row'>
          {times(30, n => <div className='heat-box' style={style()}></div>)}
        </div>
        <div className='heat-row'>
          {times(30, n => <div className='heat-box' style={style()}></div>)}
        </div>
      </div>
    </div>
  );
};

const PastWeek = () => {
  return (
    <div className='activity-past-week-container'>
      <div className='activity-details-label'>
        Past Week
      </div>

      <div className='activity-past-week'>
        <div className='activity-week-day'>S</div>
        <div className='activity-week-day completed'>M</div>
        <div className='activity-week-day'>T</div>
        <div className='activity-week-day completed'>W</div>
        <div className='activity-week-day completed'>T</div>
        <div className='activity-week-day completed'>F</div>
        <div className='activity-week-day'>S</div>
      </div>
    </div>
  );
};

const ActivityMoodScores = () => {
  // TODO
  return (
    <div className='' style={{ marginTop: 16, marginBottom: 16 }}>
      Average scores<br />
      (Depression - 4%)<br />
      (Anxiety - 8%)<br />
      (Well-being - 64%)<br />
    </div>
  );
};

const ActivityDetails = () => {
  return (
    <div className='activity-details-container'>
      <h2 className='activity-name' style={{ marginBottom: 16 }}>
        Exercise: Yoga
      </h2>

      <div className='tags-container' style={{ marginBottom: 16 }}>
        <span className='tag-box red'>Mindfulness</span>
        <span className='tag-box blue'>Exercise</span>
      </div>

      <IntensityMeter />

      <HeatMap />

      <PastWeek />

      <ActivityMoodScores />
    </div>
  );
};

export default ActivityDetails;

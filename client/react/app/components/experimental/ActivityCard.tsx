// import * as React from 'react';
// import { Task } from '../../helpers/tasks';
// import './Activity.less';

// interface ActivityCardProps {
//   task: Task;
// }

// const ActivityCard = ({ task }: ActivityCardProps) => {
//   const { description, points, category, isFavorite } = task;

//   return (
//     <div className={`activity-card-container ${isFavorite ? 'checked' : ''}`}>
//       <div className="category-tags-container">
//         <div className="activity-category-tag">{category}</div>
//       </div>

//       <div className="activity-description-container">
//         <div className="activity-description">{description}</div>
//         <div className={`activity-checkbox ${isFavorite ? 'checked' : ''}`} />
//       </div>

//       <div className="activity-points-container">
//         <div className="activity-points">
//           {points} {points === 1 ? 'point' : 'points'}
//         </div>
//         <div className="activity-points-buttons">
//           <button className="activity-points-btn btn-minus" />
//           <button className="activity-points-btn btn-plus" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ActivityCard;

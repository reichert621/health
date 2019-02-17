import * as React from 'react';
import { groupBy, keys } from 'lodash';
import styled from 'styled-components';
import { Task } from '../../helpers/tasks';
import ActivityCardSimple from './ActivityCardSimple';
import { Box, Color } from './Common';
import './Activity.less';

export const ActivityListContainer = styled(Box)`
  padding: 16px 24px;
  width: 60%;
  border-radius: 4px;
  background-color: ${Color.WHITE};
  margin-right: 24px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
`;

export const ActivityCategoryLabel = styled(Box)`
  color: ${Color.ORANGE};
  font-weight: 600;
  border-bottom: 1px solid ${Color.ORANGE};
  padding: 16px;
  margin: 16px 0px;
`;

interface ActivityListProps {
  tasks: Task[];
  onToggleTask: (task: Task) => void;
  onViewTask: (task: Task) => void;
}

const ActivityList = ({
  tasks = [],
  onToggleTask,
  onViewTask
}: ActivityListProps) => {
  const grouped = groupBy(tasks, 'category');

  return (
    <ActivityListContainer>
      {keys(grouped).map(category => {
        const tasks = grouped[category];

        return (
          <Box key={category}>
            <ActivityCategoryLabel>{category}</ActivityCategoryLabel>

            {tasks.map((task, key) => {
              return (
                <ActivityCardSimple
                  key={key}
                  task={task}
                  onToggle={() => onToggleTask(task)}
                  onView={() => onViewTask(task)}
                />
              );
            })}
          </Box>
        );
      })}
    </ActivityListContainer>
  );
};

export default ActivityList;

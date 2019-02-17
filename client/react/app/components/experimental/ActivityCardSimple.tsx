import * as React from 'react';
import styled, { css } from 'styled-components';
import { Task } from '../../helpers/tasks';
import { FlexContainer, Box, Color } from './Common';
import './Activity.less';

interface CheckboxProps {
  checked: boolean;
}

const ActivityCardContainer = styled(Box)`
  background-color: ${Color.WHITE};
  border-radius: 4px;
  color: ${Color.BLACK};
  min-height: 0px;
  width: 100%;
  box-shadow: none;
  padding: 16px;
  margin: 0;
  position: relative;
  top: 0px;
  transition: all ease 0.2s;

  &:hover {
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.24);
    top: -4px;
  }

  ${(props: CheckboxProps) =>
    props.checked &&
    css`
      background-color: ${Color.LIGHT_BEIGE};
      box-shadow: none;
    `}
`;

const ActivityCheckbox = styled(Box)`
  background: rgba(0, 0, 0, 0.02);
  box-shadow: inset 0px 0px 4px rgba(0, 0, 0, 0.16);
  border-radius: 8px;
  cursor: pointer;
  height: 32px;
  margin-right: 16px;
  width: 32px;

  ${(props: CheckboxProps) =>
    props.checked &&
    css`
      background-image: url('assets/check-orange.svg');
      background-repeat: no-repeat;
      background-position: center;
      background-size: 24px;
    `}
`;

const ActivityDescription = styled(Box)`
  letter-spacing: 1.2px;
`;

const ExpandActivity = styled(Box)`
  cursor: pointer;
  opacity: 0;
  margin-right: 0px;
  font-size: 14px;
  font-weight: 500;
  color: ${Color.LIGHT_BROWN};
  transition: all ease 0.2s;

  ${ActivityCardContainer}:hover & {
    opacity: 1;
    margin-right: 16px;
  }

  &:hover {
    color: ${Color.ORANGE};
  }
`;

interface Props {
  task: Task;
  onToggle: () => void;
  onView: () => void;
}

const ActivityCardSimple = ({ task, onToggle, onView }: Props) => {
  const { description, isComplete } = task;

  return (
    <ActivityCardContainer checked={isComplete}>
      <FlexContainer alignItems="center" justifyContent="space-between">
        <FlexContainer alignItems="center">
          <ActivityCheckbox checked={isComplete} onClick={onToggle} />

          <ActivityDescription>{description}</ActivityDescription>
        </FlexContainer>

        <ExpandActivity onClick={onView}>View</ExpandActivity>
      </FlexContainer>
    </ActivityCardContainer>
  );
};

export default ActivityCardSimple;

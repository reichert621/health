import * as React from 'react';
import styled from 'styled-components';
import { Container, FlexContainer } from './Common';

interface ColorIndicatorProps {
  color: string;
}

const LabelColorIndicator = styled.div`
  background: ${(props: ColorIndicatorProps) => props.color};
  border-radius: 4px;
  height: 12px;
  width: 16px;
  margin-right: 8px;
  margin-left: 8px;
`;

const AnalyticsChartLabel = ({
  color,
  label,
  textColor
}: {
  color: string;
  label: string;
  textColor?: string;
}) => {
  return (
    <FlexContainer alignItems="center" mb={2}>
      <LabelColorIndicator color={color} />
      <Container fontSize={12} color={textColor}>
        {label}
      </Container>
    </FlexContainer>
  );
};

export default AnalyticsChartLabel;

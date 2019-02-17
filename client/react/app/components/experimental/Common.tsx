import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import styled, { css } from 'styled-components';
import NavBar from '../navbar';

export enum Color {
  BLUE = '#80A0C0',
  LIGHT_BEIGE = '#FBF6F0',
  BEIGE = '#F4E6DB',
  WHITE = '#fff',
  BLACK = '#382210',
  RED = '#C76666',
  ORANGE = '#E5AF70',
  ORANGE_BROWN = '#E6AF70',
  LIGHT_GREEN = '#C7D99A',
  DARK_GREEN = '#708045',
  LIGHT_BROWN = '#B88C5A',
  PURPLE = '#A68AC1'
}

export enum FontWeight {
  LIGHT = 100,
  MEDIUM = 500,
  HEAVY = 900
}

export enum FontSize {
  XS = 12,
  SM = 14,
  MD = 18,
  LG = 24,
  XL = 32
}

export enum Spacing {
  XS = 4,
  SM = 8,
  MD = 16,
  LG = 24,
  XL = 32
}

export interface StyledProps {
  // Height
  h?: number | string;
  // Width
  w?: number | string;

  // Color
  color?: Color | string;
  backgroundColor?: Color | string;
  bg?: Color | string;

  fontSize?: FontSize | number | string;
  fontWeight?: FontWeight | number | string;

  // Margin
  m?: Spacing | number | string;
  mt?: Spacing | number | string;
  mb?: Spacing | number | string;
  ml?: Spacing | number | string;
  mr?: Spacing | number | string;

  // Padding
  p?: Spacing | number | string;
  pt?: Spacing | number | string;
  pb?: Spacing | number | string;
  pl?: Spacing | number | string;
  pr?: Spacing | number | string;

  // Alignment
  justifyContent?: string;
  alignItems?: string;
  textAlign?: string;
}

const formatUnit = (value?: number | string) => {
  if (value === undefined || value === null) return null;

  return typeof value === 'number' ? `${value}px` : value;
};

const core = css`
  margin: ${(props: StyledProps) => formatUnit(props.m)};
  margin-top: ${(props: StyledProps) => formatUnit(props.mt)};
  margin-bottom: ${(props: StyledProps) => formatUnit(props.mb)};
  margin-left: ${(props: StyledProps) => formatUnit(props.ml)};
  margin-right: ${(props: StyledProps) => formatUnit(props.mr)};

  padding: ${(props: StyledProps) => formatUnit(props.p)};
  padding-top: ${(props: StyledProps) => formatUnit(props.pt)};
  padding-bottom: ${(props: StyledProps) => formatUnit(props.pb)};
  padding-left: ${(props: StyledProps) => formatUnit(props.pl)};
  padding-right: ${(props: StyledProps) => formatUnit(props.pr)};
`;

export const H1 = styled.h1`
  font-size: 44px;
  font-weight: 100;
  ${core}
`;

export const H2 = styled.h2`
  font-size: 36px;
  font-weight: 300;
  ${core}
`;

export const H3 = styled.h3`
  font-size: 28px;
  font-weight: 400;
  ${core}
`;

export const Box = styled.div`
  ${core}
`;

export const Container = styled.div`
  // display: block;
  // border: 1px solid black;
  // border-radius: 4px;

  color: ${(props: StyledProps) => props.color};
  background-color: ${(props: StyledProps) =>
    props.backgroundColor || props.bg};

  height: ${(props: StyledProps) => formatUnit(props.h)};
  width: ${(props: StyledProps) => formatUnit(props.w)};

  font-size: ${(props: StyledProps) => formatUnit(props.fontSize)};
  font-weight: ${(props: StyledProps) => formatUnit(props.fontWeight)};

  margin: ${(props: StyledProps) => formatUnit(props.m)};
  margin-top: ${(props: StyledProps) => formatUnit(props.mt)};
  margin-bottom: ${(props: StyledProps) => formatUnit(props.mb)};
  margin-left: ${(props: StyledProps) => formatUnit(props.ml)};
  margin-right: ${(props: StyledProps) => formatUnit(props.mr)};

  padding: ${(props: StyledProps) => formatUnit(props.p)};
  padding-top: ${(props: StyledProps) => formatUnit(props.pt)};
  padding-bottom: ${(props: StyledProps) => formatUnit(props.pb)};
  padding-left: ${(props: StyledProps) => formatUnit(props.pl)};
  padding-right: ${(props: StyledProps) => formatUnit(props.pr)};
`;

export const InlineContainer = styled(Container)`
  display: inline-block;
`;

export const FlexContainer = styled(Container)`
  display: flex;
  justify-content: ${(props: StyledProps) => props.justifyContent};
  align-items: ${(props: StyledProps) => props.alignItems};
`;

interface FontStyleProps {
  heavy?: boolean;
}

export const Label = styled.label`
  color: ${Color.LIGHT_BROWN};
  font-size: 12px;
  margin-bottom: 8px;
  font-weight: ${(props: FontStyleProps) => (props.heavy ? 800 : 300)};
`;

interface CommonContainerProps extends RouteComponentProps<{}> {}

interface CommonContainerState {}

class CommonContainer extends React.Component<
  CommonContainerProps,
  CommonContainerState
> {
  constructor(props: CommonContainerProps) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <div className="default-wrapper simple">
        <NavBar />

        <div className="default-container">
          <H1 mb={8}>Components</H1>

          <Container p={16} mb={8}>
            Container!
          </Container>

          <InlineContainer p={Spacing.MD} mr={8}>
            InlineContainer!
          </InlineContainer>
          <InlineContainer p={Spacing.MD} mr={8}>
            InlineContainer!
          </InlineContainer>
          <InlineContainer p={Spacing.MD} mr={8}>
            InlineContainer!
          </InlineContainer>

          <FlexContainer
            mt={16}
            mb={16}
            bg={Color.BEIGE}
            p={Spacing.SM}
            h={80}
            justifyContent="space-between"
            alignItems="center"
          >
            <Container bg={Color.WHITE} p={Spacing.SM}>
              Inside Flex #1
            </Container>
            <Container bg={Color.WHITE} p={Spacing.SM}>
              Inside Flex #2
            </Container>
            <Container bg={Color.WHITE} p={Spacing.SM}>
              Inside Flex #3
            </Container>
          </FlexContainer>
        </div>
      </div>
    );
  }
}

export default CommonContainer;

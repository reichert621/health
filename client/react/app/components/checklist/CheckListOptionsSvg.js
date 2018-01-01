import React from 'react';

const INACTIVE_COLOR = '#D2D2D2';

const LeftOption = ({ value, color, isActive, transform, handleSelect }) => {
  return (
    <g id={`box-${value}`}
      className="svg-option-box"
      onClick={() => handleSelect(value)}>
      <use className="svg-option-box"
        xlinkHref="#path0_fill"
        transform={transform}
        fill={isActive ? color : INACTIVE_COLOR} />
      <mask id={`mask_${value}_outline_out`}>
        <rect id="mask0_outline_inv" fill="white" x="-1" y="-2" width="26" height="35" transform={transform} />
        <use xlinkHref="#path0_fill" fill="black" transform={transform} />
      </mask>
      <g mask={`url(#mask_${value}_outline_out)`}>
        <use xlinkHref="#path1_stroke_2x" transform={transform} fill="#FFFFFF" />
      </g>
    </g>
  );
};

const RightOption = ({ value, color, isActive, transform, handleSelect }) => {
  return (
    <g id={`box-${value}`}
      className="svg-option-box"
      onClick={() => handleSelect(value)}>
      <use className="svg-option-box"
        xlinkHref="#path4_fill"
        transform={transform}
        fill={isActive ? color : INACTIVE_COLOR} />
      <mask id={`mask_${value}_outline_out`}>
        <rect id="mask4_outline_inv" fill="white" x="-1" y="-2" width="26" height="35" transform={transform} />
        <use xlinkHref="#path4_fill" fill="black" transform={transform} />
      </mask>
      <g mask={`url(#mask_${value}_outline_out)`}>
        <use xlinkHref="#path5_stroke_2x" transform={transform} fill="#FFFFFF" />
      </g>
    </g>
  );
};

const InnerOption = ({ value, color, isActive, transform, handleSelect }) => {
  return (
    <g id={`box-${value}`}
      className="svg-option-box"
      onClick={() => handleSelect(value)}>
      <use className="svg-option-box"
        xlinkHref="#path2_fill"
        transform={transform}
        fill={isActive ? color : INACTIVE_COLOR} />
      <mask id={`mask_${value}_outline_out`}>
        <rect id="mask1_outline_inv" fill="white" x="-1" y="-1" width="26" height="34" transform={transform} />
        <use xlinkHref="#path2_fill" fill="black" transform={transform} />
      </mask>
      <g mask={`url(#mask_${value}_outline_out)`}>
        <use xlinkHref="#path3_stroke_2x" transform={transform} fill="#FFFFFF" />
      </g>
    </g>
  );
};

const CheckListOptionsSvg = ({ num, handleSelect }) => {
  return (
    <svg width="142" height="38" className="checklist-options-svg" viewBox="0 0 142 38" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <title>Rater</title>
      <g id="rater" filter="url(#filter0_d)">

        <LeftOption
          value={0}
          color="#B8DBE9"
          isActive={num >= 0}
          transform="translate(3 2)"
          handleSelect={handleSelect} />

        <InnerOption
          value={1}
          color="#8BC9E1"
          isActive={num >= 1}
          transform="translate(31 2)"
          handleSelect={handleSelect} />

        <InnerOption
          value={2}
          color="#72BFDB"
          isActive={num >= 2}
          transform="translate(59 2)"
          handleSelect={handleSelect} />

        <InnerOption
          value={3}
          color="#4FAED1"
          isActive={num >= 3}
          transform="translate(87 2)"
          handleSelect={handleSelect} />

        <RightOption
          value={4}
          color="#33A2CC"
          isActive={num >= 4}
          transform="translate(115 2)"
          handleSelect={handleSelect} />

      </g>

      <defs>
        <filter id="filter0_d" filterUnits="userSpaceOnUse" x="0" y="0" width="142" height="38" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 255 0" />
          <feOffset dx="0" dy="1" />
          <feGaussianBlur stdDeviation="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.27941 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
        <path id="path0_fill" fillRule="evenodd" d="M 24 0L 24 31.9997C 24 31.9997 0 31.9997 0 16C 7.34773e-16 0.000319481 24 0 24 0Z" />
        <path id="path1_stroke_2x" d="M 24 0L 25 0L 25 -1.00001L 24 -1L 24 0ZM 24 31.9997L 24 32.9997L 25 32.9997L 25 31.9997L 24 31.9997ZM 23 0L 23 31.9997L 25 31.9997L 25 0L 23 0ZM 24 31.9997C 24 30.9997 24.0002 30.9997 24.0004 30.9997C 24.0003 30.9997 24.0004 30.9997 24.0002 30.9997C 23.9997 30.9997 23.9993 30.9997 23.9983 30.9997C 23.9958 30.9997 23.9928 30.9997 23.9879 30.9996C 23.9773 30.9996 23.9628 30.9995 23.9419 30.9993C 23.8984 30.9988 23.8367 30.9979 23.7527 30.996C 23.5809 30.9922 23.3358 30.9848 23.0163 30.9696C 22.3695 30.9388 21.4635 30.8786 20.3604 30.7558C 18.1375 30.5092 15.241 30.0292 12.3162 29.051C 6.44686 27.0946 1 23.3356 1 16L -1 16C -1 24.6641 5.55314 28.9049 11.6838 30.9484C 14.759 31.9702 17.8625 32.4902 20.1396 32.7436C 21.2865 32.8708 22.2555 32.9356 22.9212 32.9673C 23.2579 32.9833 23.5284 32.9915 23.7083 32.9955C 23.8 32.9976 23.8731 32.9986 23.9204 32.9991C 23.9449 32.9994 23.9649 32.9995 23.9773 32.9996C 23.984 32.9996 23.9897 32.9997 23.993 32.9997C 23.9949 32.9997 23.9966 32.9997 23.9976 32.9997C 23.9982 32.9997 23.9988 32.9997 23.9991 32.9997C 23.9996 32.9997 24 32.9997 24 31.9997ZM 1 16C 1 8.66442 6.44687 4.9053 12.3162 2.9488C 15.2411 1.97061 18.1375 1.49057 20.3604 1.24393C 21.4635 1.12111 22.3696 1.06089 23.0163 1.03013C 23.3358 1.01488 23.581 1.00747 23.7527 1.00366C 23.8367 1.00179 23.8984 1.0009 23.9419 1.00043C 23.9628 1.0002 23.9773 1.0001 23.9879 1.00005C 23.9928 1.00002 23.9958 1.00001 23.9983 1C 23.9993 1 23.9997 1 24.0002 1C 24.0004 1 24.0003 1 24.0004 1C 24.0002 1 24 1 24 0C 24 -1 23.9996 -1 23.9991 -1C 23.9988 -0.999999 23.9982 -0.999999 23.9976 -0.999998C 23.9966 -0.999997 23.9949 -0.999994 23.993 -0.999989C 23.9896 -0.99998 23.984 -0.99996 23.9773 -0.999925C 23.9649 -0.999858 23.9449 -0.999715 23.9204 -0.999453C 23.8731 -0.998942 23.8 -0.997876 23.7082 -0.995843C 23.5284 -0.991837 23.2579 -0.983607 22.9212 -0.967604C 22.2554 -0.93585 21.2865 -0.871043 20.1396 -0.743838C 17.8625 -0.490435 14.7589 0.0295895 11.6838 1.05144C 5.55313 3.09502 -1 7.3359 -1 16L 1 16Z" />
        <path id="path2_fill" fillRule="evenodd" d="M 0 0L 24 0L 24 32L 0 32L 0 0Z" />
        <path id="path3_stroke_2x" d="M 0 0L 0 -1L -1 -1L -1 0L 0 0ZM 24 0L 25 0L 25 -1L 24 -1L 24 0ZM 24 32L 24 33L 25 33L 25 32L 24 32ZM 0 32L -1 32L -1 33L 0 33L 0 32ZM 0 1L 24 1L 24 -1L 0 -1L 0 1ZM 23 0L 23 32L 25 32L 25 0L 23 0ZM 24 31L 0 31L 0 33L 24 33L 24 31ZM 1 32L 1 0L -1 0L -1 32L 1 32Z" />
        <path id="path4_fill" fillRule="evenodd" d="M 0 0C 0 0 24 0 24 16C 24 32 0 32 0 32L 0 0Z" />
        <path id="path5_stroke_2x" d="M 0 0L 0 -1L -1 -1L -1 0L 0 0ZM 0 32L -1 32L -1 33L 0 33L 0 32ZM 0 0C 0 1 -0.000234605 1 -0.000378015 1C -0.00030427 1 -0.000357764 1 -0.000211417 1C 0.000299139 1 0.000733313 1 0.00174698 1C 0.00421174 1.00001 0.00722735 1.00002 0.0121041 1.00005C 0.0227392 1.0001 0.0372205 1.0002 0.0580956 1.00043C 0.101636 1.0009 0.163287 1.00178 0.247315 1.00366C 0.419059 1.00747 0.664196 1.01487 0.983685 1.03012C 1.63046 1.06087 2.5365 1.12108 3.63957 1.24388C 5.86253 1.49051 8.75895 1.97051 11.6838 2.94868C 17.5531 4.90513 23 8.66426 23 16L 25 16C 25 7.33574 18.4469 3.09487 12.3162 1.05132C 9.24105 0.0294878 6.13747 -0.490506 3.86043 -0.743884C 2.7135 -0.871076 1.74454 -0.935872 1.07882 -0.967618C 0.742054 -0.983617 0.471566 -0.991843 0.291748 -0.995847C 0.199995 -0.997878 0.126879 -0.998944 0.0795997 -0.999454C 0.0550646 -0.999716 0.0351221 -0.999859 0.022686 -0.999925C 0.016027 -0.99996 0.0103451 -0.99998 0.00699631 -0.999989C 0.00510317 -0.999994 0.00335153 -0.999997 0.00240296 -0.999998C 0.00181975 -0.999999 0.00121837 -0.999999 0.000926616 -1C 0.000417711 -1 0 -1 0 0ZM 23 16C 23 23.3357 17.5531 27.0949 11.6838 29.0513C 8.75895 30.0295 5.86253 30.5095 3.63957 30.7561C 2.5365 30.8789 1.63046 30.9391 0.983685 30.9699C 0.664196 30.9851 0.419059 30.9925 0.247315 30.9963C 0.163287 30.9982 0.101636 30.9991 0.0580956 30.9996C 0.0372205 30.9998 0.0227392 30.9999 0.0121041 31C 0.00722735 31 0.00421174 31 0.00174698 31C 0.000733313 31 0.000299139 31 -0.000211417 31C -0.000357764 31 -0.00030427 31 -0.000378015 31C -0.000234605 31 0 31 0 32C 0 33 0.000417711 33 0.000926616 33C 0.00121837 33 0.00181975 33 0.00240296 33C 0.00335153 33 0.00510317 33 0.00699631 33C 0.0103451 33 0.016027 33 0.022686 32.9999C 0.0351221 32.9999 0.0550646 32.9997 0.0795997 32.9995C 0.126879 32.9989 0.199995 32.9979 0.291748 32.9958C 0.471566 32.9918 0.742054 32.9836 1.07882 32.9676C 1.74454 32.9359 2.7135 32.8711 3.86043 32.7439C 6.13747 32.4905 9.24105 31.9705 12.3162 30.9487C 18.4469 28.9051 25 24.6643 25 16L 23 16ZM 1 32L 1 0L -1 0L -1 32L 1 32Z" />
      </defs>
    </svg>
  );
};

export default CheckListOptionsSvg;

// import React from 'react';
// import PropTypes from 'prop-types';

// import styles from './index.less';

// function Toilet(props) {
//   const { style, data = [], onChange } = props;

//   console.log('Toilet is invoked');
//   const {
//     width = '100%',
//     itemBgColor = '#e0e0e0',
//     headerHeight = '80px',
//     headerFontSize = '24px',
//     headerFontColor = '#ffffff',
//     headerAlign = 'center',
//     headerBgColor = '',
//     floorBg = 'red',
//     fontColor = '#ffffff',
//     floorBr = 0,
//     headerBr = 0,
//     floorFontSize = '24px',
//     itemHeight = '120px',
//     itemWidth = '100%',
//     floorWidth = '160px',
//     maleWidth = '740px',
//     femaleWidth = '928px',
//     headerFloorBg = '#ffffff',
//     headeMalerBg = '#ffffff',
//     headeFemalerBg = '#ffffff',
//     iconWidth = 45,
//     iconHeight = 45,
//     iconWrapWidth = 45,
//     iconWrapHeight = 45,
//     headerMarginB = '64px',
//     itemMarginB = '48px',
//     padding = '0',
//     resetWidth = 100,
//     resetHeight = 100,
//     resetIconWidth = 42,
//     resetIconHeight = 40,
//     resetTop = 1,
//     resetRight = 1,
//     resetBr = 0,
//     resetBoxShadow = '0px 24px 40px 0px rgba(0, 0, 0, 0.23)',
//     showIcon = false,
//     showHeader = false,
//     showReset = false,
//     toiletIconStyle,
//     boxFlexDirection = 'column',
//     itemMarginR = '20px',
//     genderMarginR = '20px',
//   } = style;

//   const sameStyle = {
//     display: 'flex',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     // marginLeft: '8px',
//   };

//   const toiletColumnStyle = {
//     floorStyle: {
//       width: floorWidth,
//       backgroundColor: floorBg,
//       fontSize: floorFontSize,
//       color: fontColor,
//       height: itemHeight,
//       lineHeight: itemHeight,
//       borderRadius: floorBr,
//       textAlign: headerAlign,
//     },
//     iconStyle: {
//       width: `${iconWidth}px`,
//       height: `${iconHeight}px`,
//     },
//     sameStyle: {
//       display: 'flex',
//       justifyContent: 'space-around',
//       alignItems: 'center',
//       // marginLeft: '8px',
//     },
//     iconWrapper: {
//       width: `${iconWrapWidth}px`,
//       height: `${iconWrapHeight}px`,
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       marginRight: itemMarginR,
//     },
//     maleStyle: {
//       width: maleWidth,
//       height: itemHeight,
//       padding: '0px 88px',
//       ...sameStyle,
//     },
//     femaleStyle: {
//       width: femaleWidth,
//       height: itemHeight,
//       padding: '0px 93px',
//       ...sameStyle,
//     },
//     warpperStyle: {
//       width: itemWidth,
//       height: itemHeight,
//       borderRadius: floorBr,
//       backgroundColor: itemBgColor,
//       marginBottom: itemMarginB,
//     },
//   };

//   const toiletRowStyle = {
//     floorStyle: {
//       width: floorWidth,
//       backgroundColor: floorBg,
//       fontSize: floorFontSize,
//       color: fontColor,
//       height: itemHeight,
//       lineHeight: itemHeight,
//       borderRadius: floorBr,
//       textAlign: headerAlign,
//     },
//     iconStyle: {
//       width: `${iconWidth}px`,
//       height: `${iconHeight}px`,
//     },
//     iconWrapper: {
//       width: `${iconWrapWidth}px`,
//       height: `${iconWrapHeight}px`,
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       marginRight: itemMarginR,
//       marginBottom: 12,
//     },
//     maleStyle: {
//       height: itemHeight,
//       ...sameStyle,
//     },
//     femaleStyle: {
//       height: itemHeight,
//       ...sameStyle,
//     },
//     warpperStyle: {
//       width: itemWidth,
//       borderRadius: floorBr,
//       backgroundColor: itemBgColor,
//     },
//     genderMarginR,
//   };

//   const boxFlexStyle = {
//     row: { display: 'flex', flexDirection: 'row', overflow: 'auto' },
//     column: { display: 'flex', flexDirection: 'column', overflow: 'auto' },
//   };

//   const handleRefresh = () => {
//     console.log('handleRefresh is revoked');
//     onChange &&
//       onChange({
//         includeEvents: ['fetchApi'],
//       });
//   };
//   return (
//     <div style={{ width, position: 'relative', padding }}>
//       {/* 头部类型 */}
//       {showHeader && (
//         <div
//           className={styles.headers}
//           style={{
//             height: headerHeight,
//             backgroundColor: headerBgColor,
//             borderRadius: headerBr,
//             lineHeight: headerHeight,
//             color: headerFontColor,
//             fontSize: headerFontSize,
//             textAlign: headerAlign,
//             overflow: 'hidden',
//             marginBottom: headerMarginB,
//           }}
//         >
//           <div style={{ backgroundColor: headerFloorBg, flex: `0 0 ${floorWidth}` }}>楼层</div>
//           <div style={{ backgroundColor: headeMalerBg, flex: `0 0 ${maleWidth}` }}>男</div>
//           <div style={{ backgroundColor: headeFemalerBg, flex: `0 0 ${femaleWidth}` }}>女</div>
//         </div>
//       )}

//       {/* 侧位状态 */}
//       <div style={boxFlexStyle[boxFlexDirection]}>
//         {boxFlexDirection === 'column' && Array.isArray(data) && (
//           <>
//             {data.map(item => {
//               return (
//                 <ToiletColumnItem
//                   data={item}
//                   key={Math.random()}
//                   style={{ ...toiletColumnStyle, showIcon, toiletIconStyle }}
//                 />
//               );
//             })}
//           </>
//         )}
//         {boxFlexDirection === 'row' && Array.isArray(data) && (
//           <>
//             {data.map(item => {
//               return (
//                 <ToiletRowItem
//                   data={item}
//                   key={Math.random()}
//                   style={{ ...toiletRowStyle, showIcon, toiletIconStyle }}
//                 />
//               );
//             })}
//           </>
//         )}
//       </div>

//       {/* 刷新按钮 */}
//       {showReset && (
//         <div
//           onClick={handleRefresh}
//           style={{
//             position: 'absolute',
//             width: `${resetWidth}px`,
//             height: `${resetHeight}px`,
//             top: `${resetTop}px`,
//             right: `${resetRight}px`,
//             boxShadow: resetBoxShadow,
//             textAlign: 'center',
//             lineHeight: `${resetHeight}px`,
//             borderRadius: resetBr,
//             zIndex: 99,
//           }}
//         >
//           <img
//             width={`${resetIconWidth}px`}
//             height={`${resetIconHeight}px`}
//             src={resetSvg}
//             alt=""
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// Toilet.propTypes = {
//   style: PropTypes.object,
// };

// export default Toilet;
import React from 'react';
import styles from './index.less';
export default function index(props) {
  const { style, data, onChange } = props;
  const {
    componentWidth = '400',
    FontColor = '',
    themeColor = '#e04b1e',
    BgColor = 'white',
    FontSize = 64,
    FontHigh,
    externalScale = 'e04b1e',
    internalScale = 'e04b1e',
    numberOfScale = 20,
  } = style;

  const internalHeight = componentWidth * 0.01;
  const internalWidth = componentWidth * 0.06;
  const externalHeight = componentWidth * 0.02;
  const externalWidth = componentWidth * 0.04;
  const { value = 20 } = data;
  const computeLength = Math.round((value / 100) * numberOfScale);
  console.log(computeLength);
  return (
    <div
      className={styles.out_wrapper}
      style={{
        backgroundImage: `linear-gradient(${themeColor}, transparent)`,
        width: componentWidth + 'px',
        height: componentWidth + 'px',
      }}
    >
      <div
        className={styles.inner_wrapper}
        style={{
          background: BgColor,
        }}
      >
        <ul
          className={styles.lowRow}
          style={{
            height: componentWidth * 0.75 + 'px',
            width: componentWidth * 0.75 + 'px',
          }}
        >
          {numberOfScale >= 1 &&
            [...new Array(parseInt(numberOfScale))].map((item, index) => (
              <li
                index={index}
                className={styles.li1}
                style={{
                  transform: `rotate(${(index * 360) / numberOfScale}deg)`,
                  background: externalScale,
                  transformOrigin: `center ${(componentWidth * 0.75) / 2}px`,
                  left: `${(componentWidth * 0.75) / 2 - internalWidth / 2}px`,
                  width: internalWidth + 'px',
                  height: internalHeight + 'px',
                }}
              ></li>
            ))}
        </ul>
        <ul
          className={styles.sepcial}
          style={{
            height: componentWidth * 0.76 + 'px',
            width: componentWidth * 0.76 + 'px',
          }}
        >
          {computeLength >= 1 &&
            [...new Array(parseInt(computeLength))].map((item, index) => (
              <li
                className={styles.li2}
                key={index}
                style={{
                  transform: `rotate(${(index * 360) / numberOfScale}deg)`,
                  background: internalScale,
                  transformOrigin: `center ${(componentWidth * 0.76) / 2}px`,
                  left: `${(componentWidth * 0.76) / 2 - externalWidth / 2}px`,
                  width: externalWidth + 'px',
                  height: externalHeight + 'px',
                }}
              ></li>
            ))}
        </ul>

        <p
          className={styles.text}
          style={{ color: FontColor, fontSize: FontSize + 'px', marginTop: FontHigh + 'px' }}
        >
          {value}%
        </p>
      </div>
    </div>
  );
}

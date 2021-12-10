import {
  FengmapFloorControl,
  Fengmap3DControl,
  FengmapCompassControl,
  FengmapResetControl,
  FengmapNavigation,
} from '../../../components/react-fengmap';

/** 楼层 **/
export function renderFloorControl(style, btnStyle, btnController, disabledFloors) {
  const {
    buttonPosition,
    showFloor,
    showBtnCount,
    distanceX,
    distanceY,
    isStarbucks,
    showHorizontal,
    openDirection,
    openMargin,
  } = style;
  const BtnPositionFloor = buttonPosition ? buttonPosition : 'RIGHT_BOTTOM';
  const position = btnController[BtnPositionFloor];
  return (
    <FengmapFloorControl
      visible={showFloor}
      ctrlOptions={{
        position: position,
        showBtnCount: showBtnCount,
        offset: {
          x: distanceX,
          y: distanceY,
        },
      }}
      labelFormater={v => `L${v}`}
      style={btnStyle}
      isStarbucks={isStarbucks}
      showHorizontal={showHorizontal}
      openDirection={openDirection}
      openMargin={openMargin}
      disabledFloors={disabledFloors}
    />
  );
}

/** 重置按钮 **/
export function renderResetControl(style, btnStyle, btnController, onClickResetIcon) {
  const {
    resetPosition,
    showReset,
    resetPositionX,
    resetPositionY,
    resetPadding,
    resetUrl,
  } = style;
  const position = btnController[resetPosition];
  return (
    <FengmapResetControl
      visible={showReset}
      ctrlOptions={{
        position,
        offset: {
          x: resetPositionX,
          y: resetPositionY,
        },
        padding: resetPadding || 0,
        resetUrl: resetUrl,
      }}
      style={btnStyle}
      onResetChange={onClickResetIcon}
    />
  );
}

/** 3D按钮 **/
export function render3DControl(style, btnStyle, btnController, fengmapSDK) {
  const { containerId, show3D, init3D, buttonPosition3D, distanceX3D, distanceY3D, imgURL } = style;
  const BtnPosition3D = buttonPosition3D ? buttonPosition3D : 'RIGHT_BOTTOM';
  const position = btnController[BtnPosition3D];
  return (
    <Fengmap3DControl
      containerId={containerId}
      visible={show3D}
      fengmapSDK={fengmapSDK}
      ctrlOptions={{
        init2D: !init3D, //false,
        position: position,
        imgURL: imgURL || '/assets/',
        viewModeButtonNeeded: show3D,
        groupsButtonNeeded: false,
        offset: {
          x: distanceX3D,
          y: distanceY3D,
        },
      }}
      style={btnStyle}
    />
  );
}

/** 指北针 **/
export function renderCompassControl(style, onClick) {
  const { showCompass = false } = style || {};
  return (
    <FengmapCompassControl
      visible={showCompass || false}
      // image={{
      //   bg: '../../../assets/map/compass_bg.png',
      //   fg: '../../../assets/map/compass_bg.png',
      // }}
      onClick={onClick}
    />
  );
}

/** 导航 **/
export function renderNavigationControl(navigationPosition, fengmapSDK) {
  const { Start, End } = navigationPosition;
  return (
    <FengmapNavigation
      naviOptions={{
        lineStyle: {
          lineType: fengmapSDK.FMLineType.FMARROW,
          lineWidth: 6,
        },
      }}
      start={Start}
      end={End}
      // events={Events}
      // onDrawComplete={OnDrawComplete}
    />
  );
}

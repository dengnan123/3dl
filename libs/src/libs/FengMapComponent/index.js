import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import fengmapSDK from 'fengmap';
import {
  FengmapBase,
  FengmapNavigation,
  FengmapFloorControl,
  Fengmap3DControl,
  FengmapCompassControl,
  FengmapResetControl,
  FengmapZoomControl,
  FengmapRotateControl,
} from 'react-fengmap';
import _ from 'lodash';

// eslint-disable-next-line no-unused-vars
class Map extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    this.fengBaseRef = React.createRef();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      !_.isEqual(prevProps.authMapFeat, this.props.authMapFeat) ||
      !_.isEqual(prevProps.navigation, this.props.navigation) ||
      !_.isEqual(prevProps.mapOptionsNoPack, this.props.mapOptionsNoPack)
    ) {
      setTimeout(() => {
        this.fengBaseRef.current._destroy();
        this.fengBaseRef.current._loadMap(this.props.mapOptionsToMapPack.mapId);
      }, 0);
    }
  }

  render() {
    const {
      width,
      height,
      authMapFeat,
      navigation,
      mapOptionsNoPack,
      mapOptionsToMapPack,
      startPoint,
      endPoint,
    } = this.props;

    return (
      <FengmapBase
        ref={this.fengBaseRef}
        fengmapSDK={fengmapSDK}
        mapId={mapOptionsToMapPack.mapId}
        mapOptions={{
          ...mapOptionsToMapPack,
          compassSize: mapOptionsNoPack.compassSize,
          defaultMapScale: mapOptionsNoPack.defaultMapScale,
          mapScaleRange: mapOptionsNoPack.mapScaleRange,
          defaultControlsPose: mapOptionsNoPack.defaultControlsPose,
        }}
        loadingTxt={mapOptionsNoPack.loadingTxt}
        gestureEnableController={{
          enableMapPinch: authMapFeat.includes('scale'),
          enableMapIncline: true,
          enableMapPan: authMapFeat.includes('move'),
        }}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          fontFamily: 'PorscheNextWAr',
          borderRadius: '50px',
          background: '#000000',
        }}
        events={
          {
            // loadComplete: _onMapLoaded,
            // mapClickNode: mapClickNode,
            // focusGroupIDChanged: (v, map) => floorChange(v, map)
          }
        }
        FMDirection={{
          FACILITY: 1,
        }}
      >
        {authMapFeat.includes('navigation') ? (
          <FengmapNavigation
            naviOptions={{
              lineStyle: {
                lineType: fengmapSDK.FMLineType[navigation.lineType],
                lineWidth: navigation.lineWidth,
              },
            }}
            start={startPoint}
            end={endPoint}
          />
        ) : null}

        {authMapFeat.includes('reload') ? (
          <FengmapResetControl
            ctrlOptions={{
              position: fengmapSDK.controlPositon.RIGHT_BOTTOM,
              imgURL: '/assets/reset.png',
            }}
          />
        ) : null}

        {authMapFeat.includes('floor') ? (
          <FengmapFloorControl
            ctrlOptions={{
              position: fengmapSDK.controlPositon.RIGHT_TOP,
              showBtnCount: 7,
            }}
            labelFormater={v => `L${v}`}
          />
        ) : null}

        {authMapFeat.includes('2/3D') ? (
          <Fengmap3DControl
            ctrlOptions={{
              position: fengmapSDK.controlPositon.RIGHT_BOTTOM,
              imgURL: '/assets/',
              viewModeButtonNeeded: true,
              groupsButtonNeeded: false,
            }}
          />
        ) : null}

        <FengmapCompassControl
          visible={authMapFeat.includes('compass')}
          image={{
            bg: '/assets/compass_bg.png',
            fg: '/assets/compass_fg.png',
          }}
        />

        {authMapFeat.includes('scale') ? (
          <FengmapZoomControl
            ctrlOptions={{ position: fengmapSDK.controlPositon.RIGHT_TOP, imgURL: '/assets/' }}
          />
        ) : null}

        {authMapFeat.includes('rotate') ? (
          <FengmapRotateControl
            angle={90}
            ctrlOptions={{
              position: fengmapSDK.controlPositon.LEFT_BOTTOM,
            }}
          />
        ) : null}
      </FengmapBase>
    );
  }
}

Map.propTypes = {
  authMapFeat: PropTypes.array,
  navigation: PropTypes.object,
  mapOptionsNoPack: PropTypes.object,
  mapOptionsToMapPack: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number,
  startPoint: PropTypes.object,
  endPoint: PropTypes.object,
};

export default Map;

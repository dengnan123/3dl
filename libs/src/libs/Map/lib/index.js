import fengmapSDK from 'fengmap';
import React, { PureComponent } from 'react';
import { isArray } from 'lodash';
import PropTypes from 'prop-types';
import styles from './index.less';
import { message } from 'antd';
import { getUrlParam } from '../../../helpers/utils';
import isEqual from 'deep-eql';

import {
  FengmapBase,
  FengmapFloorControl,
  Fengmap3DControl,
  FengmapCompassControl,
  FengmapResetControl,
  FengmapNavigation,
  // FengmapZoomControl,
  // FengmapFloors,
} from '../../../components/react-fengmap';

const obj = {
  1: '#80BA01', // 绿色
  2: '#F25022', // 红色
  3: '#FFB902', // 黄色
  4: '#0240EF', // 蓝色
};

class Map extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hashColors: {},
      isSatisfyUp: false,
      map: null,
      mapList: [],
      mapHash: {},
      fids: [],
      loadComplete: false,
      isLoading: false,
      showFloorVisible: false,
      count: 0,
      Start: null,
      End: null,
      GreenFids: [],
      RedFids: [],
      YellowFids: [],
      BlueFids: [],
      style: {},
      allModels: null,
      activeKey: getUrlParam('activeKey', 'url') || '0', // 当前所用哪个地图的key
    };
    this.mapFidHash = null;
  }

  static defaultProps = {
    appKey: '3f5052ae825dc312df8f5ab84ab1c959',
    appName: '招商银行_SaaS平台', //开发者申请应用名称
    // mapServerURL: 'http://139.219.12.216:3003/static/maps', // 地图.fmap文件路径
    // mapThemeURL: 'http://139.219.12.216:3003/static/themes', // 地图.theme文件路径

    // mapServerURL: 'https://3dl.dfocus.top/api/static/maps', // 地图.fmap文件路径
    // mapThemeURL: 'https://3dl.dfocus.top/api/static/themes', // 地图.theme文件路径
  };

  componentDidMount() {
    const { map, activeKey } = this.state;
    const { style = {} } = this.props;

    const {
      navigation,
      defaultStatus,
      defaultStart,
      iconSize,
      defaultOneStatus,
      startGroup,
      dynamicStartPoint,
    } = style[activeKey] || {};

    this.versionContrast(fengmapSDK.VERSION);
    // window.addEventListener('click', this.listenerClick);
    // window.addEventListener('touchstart', this.listenerClick);
    document.body.addEventListener('click', this.listenerClick);
    document.body.addEventListener('touchstart', this.listenerClick);
    window.addEventListener(
      'hashchange',
      eve => {
        this.setState({ activeKey: getUrlParam('activeKey', 'url') });
      },
      false,
    );

    if (navigation) {
      if (defaultStatus && !defaultOneStatus && !dynamicStartPoint) {
        this.setState({
          Start: {
            options: {
              x: defaultStart.x,
              y: defaultStart.y,
              groupID: map?.focusGroupID ? map.focusGroupID : 1,
              url: '/assets/startPoint.png',
              size: iconSize || 50,
              height: 2,
            },
          },
        });
      } else if (!defaultStatus && defaultOneStatus && !dynamicStartPoint) {
        const focusGroup = map.focusGroupID || 1; // 当前地图所在楼层id
        if (
          startGroup &&
          startGroup.length &&
          startGroup[focusGroup - 1] &&
          startGroup[focusGroup - 1].x &&
          startGroup[focusGroup - 1].y
        ) {
          this.setState({
            Start: {
              options: {
                x: startGroup[focusGroup - 1].x,
                y: startGroup[focusGroup - 1].y,
                groupID: startGroup[focusGroup - 1].groupID,
                url: '/assets/startPoint.png',
                size: iconSize || 50,
                height: 2,
              },
            },
            End: null,
            count: 0,
          });
        } else {
          message.info('请检查每层起点是否设置正确');
        }
      } else if (!defaultStatus && !defaultOneStatus && dynamicStartPoint) {
        this.setState({ Start: this.props.data?.startPoint || null });
      }
    }

    // this.setState({ activeKey });
  }

  // componentWillReceiveProps(props) {
  //   if (props.style.mapId) {
  //     this.setState({
  //       defalutMapId: props.style.mapId,
  //       mapAngle: props?.style?.angle,
  //       mapScale: props?.style?.defaultMapScale || 300,
  //     });
  //   }
  // }

  listenerClick = () => {
    if (this.timeInterval) {
      clearTimeout(this.timeInterval);
      this.setState({ hasTimer: false });
    }
    this.resetMap();
  };

  versionContrast = version => {
    let isSatisfyUp = false;
    let criticalVersion = [2, 3, 0];
    let nowVersionArr = version.split('.');
    if (Number(nowVersionArr[0]) > criticalVersion[0]) {
      isSatisfyUp = true;
    } else if (Number(nowVersionArr[1]) >= criticalVersion[1]) {
      isSatisfyUp = true;
    }
    this.setState({ isSatisfyUp });
  };

  _onMapLoaded = (e, map) => {
    console.log('Map -> componentDidMount -> map', map);
    const { activeKey } = this.state;
    const { style } = this.props;
    const { angle = 0, center } = style[activeKey] || {};
    this.setState({ map, loadComplete: true });
    map.rotateAngle = 0;
    map.moveToCenter();
    map.rotateTo({ to: angle });

    // 移动至视野中心
    if (map.focusFloor && center) {
      let currentGroup = map.focusFloor;
      let groupList = map.listFloors;
      let index = groupList.indexOf(currentGroup);
      let x = center[index] ? center[index].x : null;
      let y = center[index] ? center[index].y : null;
      if (!x && !y) return;
      map.moveTo({ x, y });
    }

    this._setMapModelColor();
  };

  _setMapModelColor = () => {
    const { map } = this.state;
    const { data } = this.props;
    let serverData = [];
    if (!map) return;
    if (Object.prototype.toString.call(data) === '[object Array]') {
      serverData = data;
    } else if (Object.prototype.toString.call(data) === '[object Object]') {
      serverData = data?.mapArray || [];
    }
    const request = { types: ['model'] };
    const groupId = map.focusGroupID;
    let mapArr = null;
    fengmapSDK.MapUtil.search(map, groupId, request, result => {
      var models = result;
      if (models.length <= 0) return;
      mapArr = models;
      for (let model of models) {
        if (!model.target.FID && !model.FID) return;
        const { target } = model;
        const { FID } = target;

        for (let d of serverData) {
          if (Array.isArray(d?.fids) && d.fids.indexOf(FID) !== -1) {
            model?.target?.setColor && model.target.setColor(d.color || obj[d.state], 1);
            model?.setColor && model.setColor(d.color || obj[d.state], 1);
          }
        }

        // data.forEach(n => {
        //   if (n.fids.includes(FID)) {
        //     if (model.target.setColor) {
        //       model.target.setColor && model.target.setColor(n.color || obj[n.state], 1);
        //       return;
        //     }
        //     model.setColor && model.setColor(n.color || obj[n.state], 1);
        //   }
        //   // return n;
        // });
      }
    });
    if (this.mapFidHash) return;
    this.mapFidHash = mapArr;
  };

  componentDidUpdate(prevProps, prevState) {
    const { map, activeKey, End, mapOtherCompParamsClick } = this.state;
    const { style = {}, otherCompParams } = this.props;
    const {
      backgroundColor,
      opacity,
      navigation,
      defaultStatus,
      defaultStart,
      defaultOneStatus,
      startGroup,
      iconSize,
      // resetStatus,
    } = style[activeKey] || {};
    if (!map) return;

    this._setMapModelColor();

    // 起点 / 终点
    const start = this.props.data?.startPoint || null;
    const end = this.props.data?.endPoint || null;

    if (
      otherCompParams?.endPoint &&
      otherCompParams?.startPoint &&
      JSON.stringify(End) !== JSON.stringify(otherCompParams?.endPoint) &&
      !mapOtherCompParamsClick
    ) {
      this.setState({
        Start: otherCompParams.startPoint,
        End: otherCompParams.endPoint,
      });
      // 激活自动复位
      this.resetMap();
    } else if (
      otherCompParams?.startPoint &&
      !otherCompParams?.endPoint &&
      !mapOtherCompParamsClick
    ) {
      this.setState({
        Start: otherCompParams.startPoint,
      });
    } else if (
      JSON.stringify(prevProps.data.startPoint) !== JSON.stringify(this.state.Start) &&
      !mapOtherCompParamsClick
    ) {
      this.dynamicNavigation(start, end);
    } else if (
      JSON.stringify(prevProps.data.endPoint) !== JSON.stringify(this.state.End) &&
      !mapOtherCompParamsClick
    ) {
      this.dynamicNavigation(start, end);
    }
    if (!isEqual(prevProps, this.props) && !mapOtherCompParamsClick) {
      /**
       * 开启导航 & 开启默认起点
       * navigation: 是否开启导航
       * defaultStatus: 开启公共默认起点
       * defaultOneStatus: 开启单独默认起点
       * defaultStart: 默认起点坐标
       */
      if (navigation && defaultStatus && !defaultOneStatus && defaultStart) {
        this.setState({
          Start: {
            options: {
              x: defaultStart.x,
              y: defaultStart.y,
              groupID: map.focusGroupID,
              url: '/assets/startPoint.png',
              size: iconSize || 50,
              height: 2,
            },
          },
          End: null,
          count: 0,
        });
      }
      // 开启导航 & 开启默认 & 每层对应不同起点
      else if (navigation && defaultOneStatus) {
        const focusGroup = map.focusGroupID; // 当前地图所在楼层id
        if (
          startGroup &&
          startGroup.length &&
          startGroup[focusGroup - 1] &&
          startGroup[focusGroup - 1].x &&
          startGroup[focusGroup - 1].y
        ) {
          this.setState({
            Start: {
              options: {
                x: startGroup[focusGroup - 1].x,
                y: startGroup[focusGroup - 1].y,
                groupID: startGroup[focusGroup - 1].groupID,
                url: '/assets/startPoint.png',
                size: iconSize || 50,
                height: 2,
              },
            },
            End: null,
            count: 0,
          });
        } else {
          message.info('请检查每层起点是否设置正确');
        }
      }
    }

    // 设置背景色
    if (backgroundColor && backgroundColor !== undefined) {
      let bgColor = this.props.style[activeKey].backgroundColor;
      let op = opacity ? opacity : 1;
      map.setBackgroundColor(bgColor, op);
    }

    // 设置角度
    this.setAngle(this.props.style[activeKey]?.angle || 0);
  }

  setAngle = angle => {
    const { map } = this.state;
    if (!map) return;
    map.rotateTo({ to: angle });
  };

  _onChange = opts => {
    const { onChange } = this.props;
    onChange && onChange(opts);
  };

  _onFloorChange = (value, map) => {
    const { activeKey } = this.state;
    const { style, onChange } = this.props;
    const { center = [], startGroup } = style[activeKey];
    this.renderIndex += 1;
    // 设置每层对应起点
    if (map.focusGroupID && startGroup && !!startGroup.length) {
      this.setStartPoint(null, map);
    }
    // 移动至视野中心
    if (map.focusFloor) {
      // this._onChange({ floorId: map.focusFloor });
      let currentGroup = map.focusFloor;
      let groupList = map.listFloors;
      let index = groupList.indexOf(currentGroup);
      let x = center[index] ? center[index].x : null;
      let y = center[index] ? center[index].y : null;
      if (x && y) {
        map.moveTo({ x, y });
      }
    }
    onChange &&
      onChange({
        includeEvents: ['fetchApi'],
        floor: map.focusFloor,
      });
    this._setMapModelColor();
  };

  mapClickNode = (e, map) => {
    const { activeKey, count } = this.state;
    const { data, style, onChange, otherCompParams } = this.props;
    const { OccStatus, modelSelectedEffect, navigation, defaultStatus, defaultOneStatus } = style[
      activeKey
    ];

    // 地图点击导航
    if (e.target && e.target.FID && navigation) {
      if (navigation && count === 0 && !defaultStatus && !defaultOneStatus) {
        // （设置起点）只开启路径指引的情况下
        this.setStartPoint(e, map);
      } else if (navigation && count === 1 && !defaultStatus && !defaultOneStatus) {
        // （设置终点）只开启路径指引的情况下
        this.setEndPoint(e, map);
        this.setState({ mapOtherCompParamsClick: false });
      } else if (
        ((navigation && defaultStatus) || (navigation && defaultOneStatus)) &&
        !otherCompParams?.startPoint
      ) {
        // 开启路径指引 && 开启默认起点 && 不开启对应楼层起点
        this.setStartPoint(e, map);
        this.setEndPoint(e, map);
        this.setState({ mapOtherCompParamsClick: false });
      } else if (otherCompParams?.startPoint) {
        this.setState({ mapOtherCompParamsClick: true });
        this.setEndPoint(e, map);
      }
    }

    console.log(e.target ? e.target.FID : e.target, '===Click+++FID===');

    // 地图点击的model触发事件
    if (isArray(data) && e.target && e.target.FID) {
      const clickItemModel = (data || []).find(item => item.fids.includes(e.target.FID));
      /**
       * spaceStatus => 1：绿色  2：红色  3:黄色  4:蓝色
       * spaceType: => 1: 工位， 2: 会议室,
       */
      //  OccStatus ? clickItemModel : {}
      if (clickItemModel) {
        if (OccStatus) {
          if (clickItemModel.spaceStatus === 1) {
            onChange &&
              onChange({
                includeEvents: [
                  'showComps',
                  'hiddenComps',
                  'passParams',
                  'callback',
                  'paramsCache',
                  'langChange',
                  'fetchApi',
                ],
                ...clickItemModel,
                // excludeEvents: ['showComps', 'hiddenComps']
              });
          }
        } else {
          onChange &&
            onChange({
              includeEvents: [
                'showComps',
                'hiddenComps',
                'passParams',
                'callback',
                'paramsCache',
                'langChange',
                'fetchApi',
              ],
              ...clickItemModel,
              // excludeEvents: ['showComps', 'hiddenComps']
            });
          if (!modelSelectedEffect && clickItemModel.spaceStatus === 1) {
            const { fids } = clickItemModel;
            const selectModels = this.mapFidHash.filter(
              m => fids.includes(m.target.FID) && (m.target.setColor || m.setColor),
            );
            this.setSelectedColorArray(selectModels);
          }
        }
      }
      if (!clickItemModel) {
        this.clearSelectModels();
      }
    }

    if (!e.target) {
      this.clearSelectModels();
    }
  };

  clearSelectModels = () => {
    const { data } = this.props;
    const { selectModels } = this.state;
    if (!selectModels || !data) return;

    selectModels.forEach(item => {
      const found = data.find(desk => desk.fids.includes(item.target.FID));
      if (found) {
        item.target?.setColor && item.target.setColor(found.color, 1);
        item.setColor && item.setColor(found.color, 1);
      } else {
        item.setColorToDefault && item.target.setColorToDefault();
        item.setColorToDefault && item.setColorToDefault();
      }
    });

    this.setState({ selectModels: null });
  };

  setSelectedColorArray = selectModelArr => {
    this.setState({ selectModels: selectModelArr });
    selectModelArr.forEach(item => {
      item.target?.setColor && item.target.setColor('#FFB902', 1);
      item.setColor && item.setColor('#FFB902', 1);
    });
  };

  setStartPoint = (e, map) => {
    const { count, activeKey } = this.state;
    const { style } = this.props;
    const {
      navigation,
      defaultStatus,
      defaultStart,
      defaultOneStatus,
      startGroup,
      iconSize,
    } = style[activeKey];
    // 开启导航 & 不开启默认起点 & 不开启对应楼层起点
    if (navigation && !defaultStatus && !defaultOneStatus) {
      this.setState({
        Start: {
          options: {
            x: e.mapCoord.x,
            y: e.mapCoord.y,
            groupID: map.focusGroupID,
            url: '/assets/startPoint.png',
            size: iconSize || 50,
            height: 2,
          },
        },
        End: null,
        count: count + 1,
      });
    }
    // 开启导航 & 开启默认起点
    else if (navigation && defaultStatus && !defaultOneStatus) {
      this.setState({
        Start: {
          options: {
            x: defaultStart.x,
            y: defaultStart.y,
            groupID: map.focusGroupID,
            url: '/assets/startPoint.png',
            size: iconSize || 50,
            height: 2,
          },
        },
        End: null,
        count: 0,
      });
    }
    // 开启导航 & 开启默认 & 每层对应不同起点
    else if (navigation && defaultOneStatus) {
      const focusGroup = map.focusGroupID; // 当前地图所在楼层id
      if (startGroup && startGroup.length && startGroup[focusGroup - 1]) {
        this.setState({
          Start: {
            options: {
              x: startGroup[focusGroup - 1].x,
              y: startGroup[focusGroup - 1].y,
              groupID: startGroup[focusGroup - 1].groupID,
              url: '/assets/startPoint.png',
              size: iconSize || 50,
              height: 2,
            },
          },
          End: null,
          count: 0,
        });
      } else {
        message.info('请检查每层起点是否设置正确');
      }
    }
  };

  setEndPoint = (e, map) => {
    this.setState({
      End: {
        options: {
          x: e.mapCoord.x,
          y: e.mapCoord.y,
          groupID: map.focusGroupID,
          url: '/assets/endPoint.png',
          size: 50,
          height: 2,
        },
      },
      count: 0,
    });
  };

  dynamicNavigation = (startPoint, endPoint) => {
    const { activeKey, count } = this.state;
    const { style } = this.props;
    const { dynamicStartPoint = false, dynamicEndPoint = false } = style[activeKey] || {};
    if (dynamicStartPoint && startPoint) {
      this.setState({
        Start: startPoint,
        // End: null,
        count: count + 1,
      });
      // 激活自动复位
      this.resetMap();
    }
    if (dynamicEndPoint && endPoint) {
      this.setState({ End: endPoint, count: 0 });
      // 激活自动复位
      this.resetMap();
    }
  };

  clearEndPoint = () => this.setState({ End: null, count: 0 });

  handleClickCompass = () => {};

  resetMap = () => {
    const { map, newState, activeKey, mapAngle } = this.state;
    const { resetStatus, resetTime, angle = 0, defaultMapScale } =
      this.props.style[activeKey] || {};
    if (resetStatus) {
      if (this.timeInterval) {
        clearTimeout(this.timeInterval);
      }
      this.timeInterval = setTimeout(() => {
        // const { map } = this.state;
        this.setState({ mapOtherCompParamsClick: false });
        if (!map) return;
        let map3DControl = document.getElementsByClassName('fm-control-tool-3d');
        let mapIndoor3DControl = map3DControl[0];

        let mapIndoor3DMode = map._viewMode;
        if (mapIndoor3DControl && mapIndoor3DMode !== 'top') {
          mapIndoor3DControl.click();
        }
        const { mapScale: stateScale, angle: stateAngle } = newState || {};
        this.clearEndPoint();
        map.rotateTo({ to: mapAngle ? mapAngle : angle, duration: 0 });
        map.moveToCenter();
        map.tiltTo({ to: 0, duration: 0 });
        map.rotateTo({ to: stateAngle ? stateAngle : angle, duration: 0 });
        map.scaleTo({ scale: stateScale ? stateScale : defaultMapScale, duration: 0.5 });
      }, resetTime * 1000);
    } else {
      if (this.timeInterval) {
        clearTimeout(this.timeInterval);
        this.timeInterval = null;
      }
    }
  };

  render() {
    const { isSatisfyUp, Start, End, activeKey } = this.state;
    const { width, height, style = {}, appKey, appName } = this.props;
    const {
      containerId,

      mapServerURL,
      mapThemeURL,
      mapId,
      angle,

      btnBorder,
      btnShadow,
      btnBoxShadow,
      btnWidth = 42,
      btnHeight = 42,
      btnRadius = 0,
      buttonPosition,
      btnFontSize = 12,
      btnFontWeight = 400,
      buttonPosition3D,
      btnFontColor = '#1E82FA',
      btnHighlightFontColor = '',
      btnBackgroundColor = '#ffffff',
      btnBackgroundColorBool = true,
      btnHighlightBackgroundColor = '',

      distanceX,
      distanceY,
      distanceX3D,
      distanceY3D,
      defaultMapScale = 200,
      defaultFocusGroup = 1,

      enableMapPinch,
      enableMapPan,
      enableMapRotate,
      enableMapIncline,

      floorBgImage,

      isStarbucks = false,

      modelSelectedEffect = false,

      resetUrl,
      resetPosition,
      resetPositionX,
      resetPositionY,
      resetPadding,

      show3D,
      showReset,
      showBtnCount,
      showCompass = false,
      showFloor,

      imgURL,
    } = style[activeKey] || {};

    const BtnPositionFloor = buttonPosition ? buttonPosition : 'RIGHT_BOTTOM';
    const BtnPosition3D = buttonPosition ? buttonPosition3D : 'RIGHT_BOTTOM';
    const BtnPostion = isSatisfyUp
      ? {
          LEFT_TOP: fengmapSDK.FMControlPosition.LEFT_TOP,
          LEFT_BOTTOM: fengmapSDK.FMControlPosition.LEFT_BOTTOM,
          RIGHT_TOP: fengmapSDK.FMControlPosition.RIGHT_TOP,
          RIGHT_BOTTOM: fengmapSDK.FMControlPosition.RIGHT_BOTTOM,
        }
      : {
          LEFT_TOP: fengmapSDK.controlPositon.LEFT_TOP,
          LEFT_BOTTOM: fengmapSDK.controlPositon.LEFT_BOTTOM,
          RIGHT_TOP: fengmapSDK.controlPositon.RIGHT_TOP,
          RIGHT_BOTTOM: fengmapSDK.controlPositon.RIGHT_BOTTOM,
        };

    const btnStyle = {
      width: btnWidth,
      height: btnHeight,
      borderRadius: btnRadius,
      lineHeight: `${btnHeight}px`,
      color: btnFontColor,
      fontSize: btnFontSize,
      fontWeight: btnFontWeight,
      backgroundColor: btnBackgroundColorBool ? btnBackgroundColor || '#fff' : 'transparent',
      btnHighlightFontColor,
      btnHighlightBackgroundColor,
      btnBackgroundColorBool,
      btnShadow,
      border: btnBorder,
      boxShadow: btnBoxShadow,
      floorBgImage,
    };

    const activeList = Object.keys(style);
    if (JSON.stringify(style) !== '{}' && !activeList.includes(activeKey)) {
      return (
        <div
          style={{
            textAlign: 'center',
            width: '100%',
            height: '100%',
            position: 'absolute',
            left: 0,
            top: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          未配置对应的地图信息
        </div>
      );
    }
    const urlFocusGroup = Number(getUrlParam('defaultFocusGroup', 'url'));
    const defaultFloor = urlFocusGroup ? urlFocusGroup : defaultFocusGroup;

    console.log('Map -> render -> defaultFloor', urlFocusGroup, defaultFocusGroup);

    return (
      <div
        id={!!containerId ? containerId : 'fengMap'}
        style={{ position: 'relative' }}
        className={styles.mapContainer}
      >
        <FengmapBase
          fengmapSDK={fengmapSDK}
          mapId={mapId}
          mapOptions={{
            key: appKey,
            appName,
            defaultThemeName: mapId,
            mapServerURL,
            mapThemeURL,
            compassSize: 46,
            defaultViewMode: fengmapSDK.FMViewMode.MODE_2D,
            defaultMapScale: defaultMapScale, // 比例尺
            mapScaleLevelRange: [19, 23], // 比例范围
            // mapScaleRange: [200, 800], // 比例尺范围
            modelSelectedEffect, // 点击是否高亮
            defaultFocusGroup: defaultFloor,
          }}
          events={{
            loadComplete: this._onMapLoaded,
            focusGroupIDChanged: (v, map) => this._onFloorChange(v, map),
            mapClickNode: this.mapClickNode,
          }}
          loadingTxt="请填写地图ID..."
          gestureEnableController={{
            enableMapPinch,
            enableMapPan,
            enableMapRotate,
            enableMapIncline,
          }}
          style={{
            width,
            height,
            fontFamily: 'PorscheNextWAr',
            borderRadius: '50px',
            // background: '#122035',
          }}
          FMDirection={{
            FACILITY: 1,
          }}
        >
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

          <FengmapFloorControl
            visible={showFloor}
            ctrlOptions={{
              position: BtnPostion[BtnPositionFloor],
              showBtnCount: showBtnCount,
              offset: {
                x: distanceX,
                y: distanceY,
              },
            }}
            labelFormater={v => `L${v}`}
            style={btnStyle}
            isStarbucks={isStarbucks}
          />

          <Fengmap3DControl
            containerId={containerId}
            visible={show3D}
            fengmapSDK={fengmapSDK}
            ctrlOptions={{
              init2D: true,
              position: BtnPostion[BtnPosition3D],
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

          <FengmapCompassControl
            visible={showCompass || false}
            // image={{
            //   bg: '../../../assets/map/compass_bg.png',
            //   fg: '../../../assets/map/compass_bg.png',
            // }}
            onClick={this.handleClickCompass}
          />

          <FengmapResetControl
            visible={showReset}
            ctrlOptions={{
              position: BtnPostion[resetPosition],
              offset: {
                x: resetPositionX,
                y: resetPositionY,
              },
              padding: resetPadding || 0,
            }}
            style={btnStyle}
            resetUrl={resetUrl}
            defaultMapScale={defaultMapScale}
            angle={angle}
            clearEndPoint={this.clearEndPoint}
          />
        </FengmapBase>
      </div>
    );
  }
}

Map.propTypes = {
  onChange: PropTypes.func,
  info: PropTypes.object,
  screenWidth: PropTypes.number,
  saveModel: PropTypes.func,
  startPoint: PropTypes.object,
  endPoint: PropTypes.object,
  mapId: PropTypes.string,
  appKey: PropTypes.string,
  appName: PropTypes.string,
  mapClickNode: PropTypes.func,
  setPop: PropTypes.func,
  lastDivHeight: PropTypes.number,
  floorChange: PropTypes.func,
  defaultFocusGroup: PropTypes.number,
  pop: PropTypes.object,
  mapScaleLevelChanged: PropTypes.func,
};

export default Map;

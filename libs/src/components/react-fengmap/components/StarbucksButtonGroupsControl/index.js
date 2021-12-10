import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.css';

class StarbucksButtonGroupsControl extends React.Component {
  static propTypes = {
    map: PropTypes.any,
    sdk: PropTypes.any,
    height: PropTypes.number,
    ctrlOptions: PropTypes.shape({
      showBtnCount: PropTypes.number,
      position: PropTypes.number,
      offset: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
      }),
    }),
    labelFormater: PropTypes.func,
    mapOnloadOver: PropTypes.bool,
    style: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      focusFloor: props.map.focusFloor,
      showGroups: false,
      listFloors: null,
    };
  }

  componentDidMount() {
    const { map } = this.props;
    map.on('focusGroupIDChanged', () => {
      this.setState({
        focusFloor: map.focusFloor,
      });
    });

    setTimeout(() => {
      this.setState({
        focusFloor: map.focusFloor,
        listFloors: map.listFloors,
      });
    }, 500);

    window.addEventListener('click', this.listenerClick);
    window.addEventListener('touchstart', this.listenerClick);
  }

  componentWillUnmount() {
    const { map } = this.props;
    map.off('focusGroupIDChanged');

    window.removeEventListener('click', this.listenerClick);
    window.removeEventListener('touchstart', this.listenerClick);
  }

  listenerClick = e => {
    if (JSON.stringify(e.target.className).includes('floorBlock')) {
      return;
    }
    this.setState({ showGroups: false });
  };

  _getPosition = () => {
    const { sdk, ctrlOptions } = this.props;
    if (ctrlOptions && !ctrlOptions.offset && ctrlOptions.position) {
      console.log(1);
      // let top = height ? height * 0.18 : 10
      if (sdk.FMControlPosition.LEFT_TOP === ctrlOptions.position) {
        return {
          left: '10px',
          top: '10px',
        };
      }
      if (sdk.FMControlPosition.LEFT_BOTTOM === ctrlOptions.position) {
        return {
          left: '10px',
          bottom: '10px',
        };
      }
      if (sdk.FMControlPosition.RIGHT_TOP === ctrlOptions.position) {
        return {
          right: '10px',
          top: '10px',
        };
      }
      if (sdk.FMControlPosition.RIGHT_BOTTOM === ctrlOptions.position) {
        return {
          right: '10px',
          bottom: '10px',
        };
      }
    } else if (ctrlOptions && ctrlOptions.offset && !ctrlOptions.position) {
      console.log(2);
      return {
        left: `${ctrlOptions.offset.x}px`,
        top: `${ctrlOptions.offset.y}px`,
      };
    } else if (ctrlOptions && !ctrlOptions.offset && !ctrlOptions.position) {
      console.log(3);
      return {
        left: '10px',
        top: '10px',
      };
    }

    if (sdk.controlPositon.LEFT_TOP === ctrlOptions.position) {
      return {
        left: `${ctrlOptions.offset.x}px`,
        top: `${ctrlOptions.offset.y}px`,
      };
    }
    if (sdk.controlPositon.LEFT_BOTTOM === ctrlOptions.position) {
      return {
        left: `${ctrlOptions.offset.x}px`,
        bottom: `${ctrlOptions.offset.y}px`,
      };
    }
    if (sdk.controlPositon.RIGHT_TOP === ctrlOptions.position) {
      return {
        right: `${ctrlOptions.offset.x}px`,
        top: `${ctrlOptions.offset.y}px`,
      };
    }
    if (sdk.controlPositon.RIGHT_BOTTOM === ctrlOptions.position) {
      return {
        right: `${ctrlOptions.offset.x}px`,
        bottom: `${ctrlOptions.offset.y}px`,
      };
    }
  };

  _toggleShowGroups = () => {
    this.setState({
      showGroups: !this.state.showGroups,
    });
  };

  _getFloorName = (floorLevel, isFocusFloorName) => {
    const {
      labelFormater,
      map: { focusFloor },
    } = this.props;
    if (!floorLevel || Number.isNaN(floorLevel)) {
      return '';
    }
    //重置时重新设置楼层按钮显示
    if (isFocusFloorName && typeof focusFloor === 'undefined') {
      floorLevel = this.state.listFloors[0];
      setTimeout(() => {
        this.setState({
          focusFloor: floorLevel,
        });
      }, 50);
    }
    if (labelFormater) {
      return `${labelFormater(floorLevel)}`;
    }
    if (floorLevel > 0) {
      return `F${floorLevel}`;
    }
    return `B${Math.abs(floorLevel)}`;
  };

  _changeFloor = floor => {
    const { map } = this.props;
    map.focusFloor = floor;
    //切换时存储最新的楼层信息
    this.setState({
      focusFloor: floor,
    });
    this._toggleShowGroups();
  };

  _getDisplayGroups = containerPosition => {
    const { map, style } = this.props;
    const { showGroups } = this.state;
    // const { showBtnCount } = ctrlOptions;
    
    if (!showGroups || !map || !map.listFloors || map.listFloors.length === 1) {
      return null;
    }
    // const realBtnCount =
    //   showBtnCount > map.listFloors.length || showBtnCount < 1
    //     ? map.listFloors.length - 1
    //     : showBtnCount || 3;
    
    const filterFloor = map.listFloors.filter(f => f !== map.focusFloor ).reverse()
    const floorsList = [...filterFloor, map.focusFloor]

    const groupsContainerPosition = {
      // top: `-${realBtnCount * style.height}px`,
      bottom: 0,
      width: style.width,
      borderRadius: style.borderRadius,
      zindx: 100,
      padding: 3,
      backgroundColor: '#ffffff'
    };

    return (
      <div className={styles.groupsContainer} style={groupsContainerPosition}>
        {floorsList.map((floor, i) => {
          return (
            <div
              key={floor}
              className={classnames(styles.floorBlock, {
                [styles.focusFloor]: floor === map.focusFloor,
              })}
              style={{
                ...style,
                width: style.width-6,
                height: style.height-6,
                borderRadius: style.borderRadius-6,
                lineHeight: `${style.height-6}px`,
                color:
                  floor === map.focusFloor
                    ? style.btnHighlightFontColor || style.color
                    : style.color,
                backgroundColor:
                  floor === map.focusFloor
                    ? style.btnHighlightBackgroundColor || style.backgroundColor
                    : style.backgroundColor,
              }}
              onClick={() => this._changeFloor(floor)}
            >
              {this._getFloorName(floor)}
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { focusFloor } = this.state;
    const { mapOnloadOver, style } = this.props;
    const containerPosition = this._getPosition();
    let bgStyles = {}
    if(style.floorBgImage) {
      bgStyles.background = `url(${style.floorBgImage}) 50% 50% / cover no-repeat transparent` 
    }
    if(!style.btnShadow) {
      bgStyles.boxShadow = 'none';
    }
    return (
      <div
        className={styles.verticalButtonGroup}
        style={Object.assign({}, containerPosition, {
          display: mapOnloadOver ? 'block' : 'none',
          ...style,
        })}
      >
        {this._getDisplayGroups(containerPosition)}
        <div
          className={classnames(styles.floorBlock, styles.withBorder, styles.active)}
          style={{
            ...style,
            ...bgStyles,
            color: '#ffffff',
            fontWeight: 'lighter',
          }}
          onClick={this._toggleShowGroups}
        >
          {this._getFloorName(focusFloor, true)}
        </div>
      </div>
    );
  }
}

export default StarbucksButtonGroupsControl;

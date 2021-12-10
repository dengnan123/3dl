import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isChildrenValid } from './helpers/validator';
import { isArray, isFunction } from './helpers/object';
import { isOrderIE } from './helpers/browser';
import { initFloorsToMapInstance } from './helpers/map';
import { notification } from 'antd';

const EVENTS = [
  'focusGroupIDChanged',
  'loadComplete',
  'mapClickNode',
  'mapHoverNode',
  'mapScaleLevelChanged',
  'scaleLevelChanged',
  'visibleGroupIDsChanged',
];

const INNER_STYLE = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: '0px',
  left: '0px',
  backgroundColor: 'transparent',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

class FengmapBase extends Component {
  static propTypes = {
    isFengmapBase: PropTypes.bool,
    reference: PropTypes.any,
    mapOptions: PropTypes.object.isRequired,
    events: PropTypes.object,
    mapId: PropTypes.string,
    style: PropTypes.object,
    fengmapSDK: PropTypes.any.isRequired,
    loadingTxt: PropTypes.string,
    supportTxt: PropTypes.string,
    gestureEnableController: PropTypes.shape({
      enableMapHover: PropTypes.bool,
      enableMapPan: PropTypes.bool,
      enableMapPinch: PropTypes.bool,
      enableMapRotate: PropTypes.bool,
      enableMapIncline: PropTypes.bool,
      enableMapSingleTap: PropTypes.bool,
    }),
    children: PropTypes.any,
  };

  static defaultProps = {
    loadingTxt: '地图加载中...',
    supportTxt: '您使用的浏览器暂不支持地图，请升级或改用Chrome获取更好的服务',
  };

  constructor(props) {
    super(props);

    this.mapContainer = React.createRef();
    this.loadingTxt = React.createRef();

    isChildrenValid(props.children);

    this.refs = null;

    this.isFengmapBase = props.isFengmapBase === undefined ? true : props.isFengmapBase;
  }

  openNotification = () => {
    notification['warning']({
      message: '友情提示',
      description: '请输入地图专属mapId查看地图',
    });
  };

  _loadMap = mapId => {
    return new Promise((resolve, reject) => {
      const { mapOptions, events, fengmapSDK } = this.props;
      if (!mapId || !fengmapSDK || isOrderIE()) {
        // this.openNotification();
        return resolve();
      }

      if (this.mapInstance) {
        this.mapContainer.current.innerHTML = '';
      }

      const mapObj = Object.assign({}, mapOptions, { container: this.mapContainer.current });
      this.mapInstance = new fengmapSDK.FMMap(mapObj);

      for (let i of EVENTS) {
        const e = i;
        this.mapInstance.on(e, event => {
          if (e === 'loadComplete') {
            this.loadingTxt.current.style['visibility'] = 'hidden';
            this._configGestureEnableController();
            this._initAllChildren(this.mapInstance);
            initFloorsToMapInstance(this.mapInstance);
            resolve();
          }

          if (events && events[e]) {
            events[e](event, this.mapInstance);
          }
          if (!this.mapInstance) {
            return;
          }
          if (events && events.mapHoverNode) {
            this.mapInstance.gestureEnableController.enableMapHover = true;
          } else {
            this.mapInstance.gestureEnableController.enableMapHover = false;
          }
        });
      }

      // EVENTS.forEach(e => {
      //   this.mapInstance.on(e, event => {
      //     if (e === 'loadComplete') {
      //       this.loadingTxt.current.style['visibility'] = 'hidden';
      //       this._configGestureEnableController();
      //       this._initAllChildren(this.mapInstance);
      //       initFloorsToMapInstance(this.mapInstance);
      //       resolve();
      //     }

      //     if (events && events[e]) {
      //       events[e](event, this.mapInstance);
      //     }
      //     if (!this.mapInstance) {
      //       return;
      //     }
      //     if (events && events.mapHoverNode) {
      //       this.mapInstance.gestureEnableController.enableMapHover = true;
      //     } else {
      //       this.mapInstance.gestureEnableController.enableMapHover = false;
      //     }
      //   });
      // });

      this.mapInstance.openMapById(mapId);
    });
  };

  _configGestureEnableController = () => {
    const { gestureEnableController } = this.props;
    if (gestureEnableController) {
      Object.keys(gestureEnableController).map(key => {
        this.mapInstance.gestureEnableController[key] = gestureEnableController[key];
        return key;
      });
    }
  };

  _initAllChildren = map => {
    const { fengmapSDK } = this.props;
    const { refs } = this;
    if (!isArray(refs)) {
      return;
    }
    for (let i in refs) {
      const ref = refs[i];
      if (ref.current && ref.current.unload) {
        ref.current.load(map, fengmapSDK, this);
      }
    }
    // refs.forEach(ref => {
    //   console.log('refref', ref);
    //   ref.current.load(map, fengmapSDK, this);
    // });
  };

  _destroyAllChildren = map => {
    const { fengmapSDK } = this.props;
    const { refs } = this;
    if (!isArray(refs)) {
      return;
    }
    for (let i in refs) {
      const ref = refs[i];
      if (ref.current && ref.current.unload) {
        ref.current.unload(map, fengmapSDK, this);
      }
    }
    // refs.forEach(ref => {
    //   if (ref.current && ref.current.unload) {
    //     ref.current.unload(map, fengmapSDK, this);
    //   }
    // });
  };

  componentDidMount() {
    this._loadMap(this.props.mapId);
    if (this.loadingTxt && this.loadingTxt.current) {
      this.loadingTxt.current.style['visibility'] = 'visible';
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.mapId === this.props.mapId) {
      return;
    }

    this._destroy();
    this._loadMap(this.props.mapId);
  }

  _destroy = () => {
    if (!this.mapInstance) {
      return;
    }

    this._destroyAllChildren(this.mapInstance);

    for (let ev of EVENTS) {
      this.mapInstance.off(ev);
    }

    // EVENTS.map(e => {
    //   this.mapInstance.off(e);
    //   return e;
    // });
    if (isFunction(this.mapInstance.dispose)) {
      try {
        this.mapInstance.dispose();
      } catch (err) {
        console.warn(err);
      }
    }
  };

  componentWillUnmount() {
    this._destroy();
  }

  render() {
    const { style, loadingTxt, children, reference } = this.props;

    if (isOrderIE()) {
      return (
        <div
          style={Object.assign({}, style, {
            display: 'table-cell',
            verticalAlign: 'middle',
            textAlign: 'center',
          })}
        >
          <span style={{ display: 'inline-block' }}>{this.props.supportTxt}</span>
        </div>
      );
    }

    const cloneChildren = cloneElements(children);
    if (cloneChildren) {
      this.refs = cloneChildren.map(c => c.ref);
    }
    return (
      <div style={Object.assign({}, style, { position: 'relative' })} ref={reference}>
        <div ref={this.mapContainer} style={INNER_STYLE} />

        <div ref={this.loadingTxt} style={INNER_STYLE}>
          {loadingTxt}
        </div>

        {cloneChildren ? cloneChildren.map(c => c.child) : null}
      </div>
    );
  }
}

export default React.forwardRef((props, ref) => <FengmapBase reference={ref} {...props} />);

function cloneElements(children) {
  if (!children) {
    return null;
  }
  if (!isArray(children)) {
    const ref = React.createRef();
    return [
      {
        child: React.cloneElement(children, {
          key: 'onlyone',
          ref,
        }),
        ref,
      },
    ];
  }
  return children.map((child, i) => {
    const ref = React.createRef();
    return {
      child: React.cloneElement(child, {
        ref,
        key: i,
      }),
      ref,
    };
  });
}

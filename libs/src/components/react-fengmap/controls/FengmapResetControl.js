import React from 'react';
import FengmapBaseControl from '../bases/FengmapBaseControl';
import PropTypes from 'prop-types';
import Reset from '../assets/reset.png';

const RESET_STYLE = {
  position: 'absolute',
  backgroundSize: 'contain',
  boxShadow: 'rgba(0, 0, 0, 0.3) 2px 2px 3px',
  cursor: 'pointer',
};

class FengmapResetControl extends FengmapBaseControl {
  static propTypes = {
    ctrlOptions: PropTypes.shape({
      position: PropTypes.number,
      offset: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
      }),
      resetUrl: PropTypes.string,
    }).isRequired,
    style: PropTypes.object,
    onResetChange: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      parent: null,
      map: null,
    };
    this.btnRef = React.createRef();
  }

  load = (map, fengmapSDK, parent) => {
    this.setState({ map, fengmapSDK, parent });
    setTimeout(() => {
      this.setState({ mapOnloadOver: true });
    }, 200);
  };

  // resetMap = () => {
  //   const { clearEndPoint, defaultMapScale, angle = 0 } = this.props;
  //   const { map } = this.state;
  //   let map3DControl = document.getElementsByClassName('fm-control-tool-3d');
  //   let mapIndoor3DControl = map3DControl[0];

  //   let mapIndoor3DMode = map._viewMode;
  //   if (mapIndoor3DControl && mapIndoor3DMode !== 'top') {
  //     mapIndoor3DControl.click();
  //   }

  //   clearEndPoint();
  //   map.moveToCenter();
  //   map.tiltTo({ to: 0, duration: 0 });
  //   map.rotateTo({ to: angle, duration: 0 });
  //   map.scaleTo({ scale: defaultMapScale, duration: 0.5 });
  //   // map.scaleTo({ duration: 0.5, scale: map._mapScale });
  // };

  getResetPosition = () => {
    let x = 0;
    let y = 0;
    const { ctrlOptions } = this.props;
    const { position, padding } = ctrlOptions;
    if (ctrlOptions.hasOwnProperty('offset')) {
      x = ctrlOptions.offset.x;
      y = ctrlOptions.offset.y;
    }

    switch (position) {
      case 1:
        return { left: `${x}px`, top: `${y}px`, padding };
      case 3:
        return { right: `${x}px`, top: `${y}px`, padding };
      case 2:
        return { left: `${x}px`, bottom: `${y}px`, padding };
      case 4:
        return { right: `${x}px`, bottom: `${y}px`, padding };
      default:
        return { left: `${x}px`, bottom: `${y}px`, padding };
    }
  };

  componentWillUpdate(nextProps) {
    const { ctrlOptions } = this.props;
    if (JSON.stringify(ctrlOptions) !== JSON.stringify(nextProps.ctrlOptions)) {
      this.getResetPosition();
    }
  }

  componentWillUnmount() {}

  render() {
    const { map } = this.state;
    const { visible, style, ctrlOptions, onResetChange } = this.props;
    const { resetUrl } = ctrlOptions;
    if (!map) {
      return null;
    }
    const newStyle = Object.assign({}, style, RESET_STYLE, this.getResetPosition());
    const othersStyles = {};
    if (!style.btnShadow) {
      othersStyles.boxShadow = 'none';
    } else {
      othersStyles.boxShadow = style.boxShadow;
    }

    if (!style.btnBackgroundColorBool) {
      othersStyles.backgroundColor = `transparent`;
    }
    return (
      <div
        id="resetBtn"
        ref={this.btnRef}
        onClick={onResetChange}
        style={{
          ...newStyle,
          display: visible ? 'block' : 'none',
          zIndex: 100,
          // backgroundColor: '#fff',
          ...othersStyles,
        }}
      >
        <img
          style={{ width: '100%', height: '100%', verticalAlign: 'top' }}
          src={resetUrl || Reset}
          alt=""
        />
      </div>
    );
  }
}

export default FengmapResetControl;

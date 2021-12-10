import React from 'react';
import FengmapBaseControl from '../bases/FengmapBaseControl';
import PropTypes from 'prop-types';

import HorizontalButtonGroupsControl from '../components/HorizontalButtonGroupsControl';
import VerticalButtonGroupsControl from '../components/VerticalButtonGroupsControl';
import StarbucksButtonGroupsControl from '../components/StarbucksButtonGroupsControl';

class FengmapFloorControl extends FengmapBaseControl {
  static propTypes = {
    ctrlOptions: PropTypes.shape({
      allLayer: PropTypes.bool,
      showBtnCount: PropTypes.number,
      position: PropTypes.number,
      offset: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
      }),
    }).isRequired,
    labelFormater: PropTypes.func,
    style: PropTypes.object,
    isStarbucks: PropTypes.bool,
    showHorizontal: PropTypes.bool,
    openDirection: PropTypes.string,
    openMargin: PropTypes.number,
  };

  constructor(props) {
    super(props);

    this.state = {
      map: null,
      fengmapSDK: null,
      mapOnloadOver: false,
    };
  }

  load = (map, fengmapSDK, parent) => {
    if (!parent.isFengmapBase) {
      throw new Error('<FengmapFloorControl /> cannot work with <FengmapFloors />');
    }

    this.resizeHandler = () => {
      // this.resizeTimer = setTimeout(() => {
      //   try {
      //     this.setState({
      //       showHorizontal: map.height < 450
      //     })
      //   } catch (error) {
      //     console.warn(error.message)
      //   }
      // }, 1000)
    };

    // window.addEventListener('resize', this.resizeHandler)
    this.setState({
      map,
      fengmapSDK,
      mapOnloadOver: true,
    });

    setTimeout(this.resizeHandler, 500);
  };

  unload = (map, fengmapSDK, parent) => {
    clearTimeout(this.resizeTimer);
    window.removeEventListener('resize', this.resizeHandler);
    this.setState({
      mapOnloadOver: false,
    });
  };

  // componentWillUnmount() {
  //   window.removeEventListener('resize', this.resizeHandler)
  // }

  render() {
    const {
      labelFormater,
      visible,
      showHorizontal,
      openDirection,
      openMargin,
      height,
      ctrlOptions,
      style,
      isStarbucks,
      disabledFloors,
    } = this.props;
    const { map, fengmapSDK, mapOnloadOver } = this.state;

    if ((!map && !mapOnloadOver) || !visible) {
      return null;
    }
    let ButtonGroupsControl = showHorizontal
      ? HorizontalButtonGroupsControl
      : VerticalButtonGroupsControl;

    if (isStarbucks) {
      ButtonGroupsControl = StarbucksButtonGroupsControl;
    }

    return (
      <ButtonGroupsControl
        ctrlOptions={ctrlOptions || {}}
        // height={map.height}
        height={height}
        sdk={fengmapSDK}
        map={map}
        labelFormater={labelFormater}
        mapOnloadOver={mapOnloadOver}
        style={style}
        openDirection={openDirection}
        openMargin={openMargin}
        disabledFloors={disabledFloors}
      />
    );
  }
}

export default FengmapFloorControl;

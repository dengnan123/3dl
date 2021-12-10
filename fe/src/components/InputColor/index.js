import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import { removeSpace } from '../../helpers/utils';
import { SketchPicker } from 'react-color';
import { Icon } from 'antd';

import { getSketchPickerPosition } from '../../helpers/sketchPickerHandler';

import styles from './index.less';

class InputColor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayColorPicker: false,
    };
    this.sketchRef = React.createRef();
  }

  handleClick = e => {
    const currentTarget = e.currentTarget;

    this.setState({ displayColorPicker: true, show: true, left: 0, top: -1000 }, () => {
      const sketchPickerHeight = this.sketchRef.current.offsetHeight;
      const { left, top } = getSketchPickerPosition(currentTarget, sketchPickerHeight);
      this.setState({ left, top });
    });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleClear = e => {
    e.stopPropagation();
    const { onChange } = this.props;
    onChange && onChange('');
  };

  handleChange = color => {
    const { onChange } = this.props;
    onChange && onChange(`rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`);
  };

  render() {
    const { left, top, displayColorPicker } = this.state;

    const { value, placeholder = '请选择颜色' } = this.props;

    let color = value;
    if (value && typeof value === 'string') {
      if (value.includes('rgba')) {
        color = getRgbaObj(value);
      }
      if (value.startsWith('#')) {
        const rgba = color2Rgba(value);
        color = getRgbaObj(rgba);
      }
    }

    const hasError = this.props['data-__field']?.errors;

    return (
      <div className={styles.container}>
        <div
          className={classnames(styles.swatch, { [styles.hasError]: hasError })}
          onClick={this.handleClick}
        >
          {!color ? (
            <span className={styles.placeholder}>{placeholder}</span>
          ) : (
            <div
              style={{
                backgroundColor: color
                  ? `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
                  : 'rgba(234,234,234,1)',
              }}
            />
          )}
          {color && <Icon type="close" className={styles.clear} onClick={this.handleClear} />}
        </div>
        {displayColorPicker
          ? ReactDOM.createPortal(
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  zIndex: 10000000,
                  width: '100%',
                  height: '100%',
                }}
              >
                <div className={styles.cover} onClick={this.handleClose} />
                <div ref={this.sketchRef} style={{ position: 'absolute', left, top }}>
                  <SketchPicker color={color} onChange={this.handleChange} />
                </div>
              </div>,
              document.body,
            )
          : null}
      </div>
    );
  }
}

export default InputColor;

function getRgbaObj(rgba) {
  let _rgba = removeSpace(rgba);
  if (_rgba) {
    let rgbstr = _rgba.substr(5);
    let str = rgbstr.substr(0, rgbstr.length - 1).split(',');
    const rgb = { r: str[0], g: str[1], b: str[2], a: str[3] };
    return rgb;
  }
  return _rgba;
}

function color2Rgba(colorStr) {
  // 把颜色值变成小写
  let color = colorStr.toLowerCase();

  if (color.length === 4) {
    // 如果只有三位的值，需变成六位，如：#fff => #ffffff
    let colorNew = '#';
    for (var i = 1; i < 4; i += 1) {
      colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
    }
    color = colorNew;
  }
  // 处理六位的颜色值，转为RGB
  let colorChange = [];
  for (let i = 1; i < 7; i += 2) {
    colorChange.push(parseInt('0x' + color.slice(i, i + 2)));
  }
  return 'rgba(' + colorChange.join(',') + ',1)';
}

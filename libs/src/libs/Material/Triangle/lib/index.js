/**
 * 三角形素材
 */

import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { filterObj } from '../../../../helpers/utils';
import { reap } from '../../../../components/SafeReaper';

class Triangle extends Component {
  render() {
    const { style } = this.props;

    const _style = filterObj(style, ('', null, undefined));
    const borderWidth = reap(_style, 'borderWidth', 0);
    const borderColor = reap(_style, 'borderColor', '#9000FF');
    const fillColor = reap(_style, 'backgroundColor', '#a22bb1');
    const rotation = reap(_style, 'rotate', 0);
    const opacity = reap(_style, 'opacity', 1);
    const data = {
      opacity,
      transform: `rotate(${rotation}deg)`,
    };

    return (
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 300 200"
        // style="width: 100%; height: 100%;"
        style={{ width: '100%', height: '100%', ...data }}
      >
        <polygon
          points="30,180 270,180 150,20"
          style={{
            stroke: borderColor,
            strokeWidth: borderWidth,
            fill: fillColor,
          }}
          // stroke="#24CBFF"
          // strokeWidth="0"
          // fill="#9000FF"
        ></polygon>
      </svg>
    );
  }
}

Triangle.propTypes = {};

export default Triangle;

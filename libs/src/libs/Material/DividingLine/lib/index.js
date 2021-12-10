/**
 * DividingLine: 线条
 */

import { reap } from '../../../../components/SafeReaper';
import { filterObj } from '../../../../helpers/utils';

export default props => {
  const { style } = props;
  const _style = filterObj(style, ('', null, undefined));
  const borderWidth = reap(_style, 'borderWidth', 10);
  const borderColor = reap(_style, 'borderColor', '#9000FF');
  const fillColor = reap(_style, 'backgroundColor', '#a22bb1');
  const opacity = reap(_style, 'opacity', 1);
  const rotation = reap(_style, 'rotate', 0);
  const linepadding = reap(_style, 'linepadding', false);

  const data = {
    opacity,
    transform: `rotate(${rotation}deg)`,
  };

  return (
    <svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 430 280"
      style={{ width: '100%', height: '100%', ...data }}
    >
      {linepadding ? (
        <line
          x1="-9999"
          y1="140.5"
          x2="9999"
          y2="140.5"
          style={{
            stroke: borderColor || '#24CBFF',
            strokeWidth: borderWidth,
            fill: fillColor,
          }}
          // stroke="#24CBFF"
          // strokeWidth="1"
        ></line>
      ) : (
        <line
          x1="40"
          y1="140.5"
          x2="400"
          y2="140.5"
          style={{
            stroke: borderColor || '#24CBFF',
            strokeWidth: borderWidth,
            fill: fillColor,
          }}
          // stroke="#24CBFF"
          // strokeWidth="1"
        ></line>
      )}
    </svg>
  );
};

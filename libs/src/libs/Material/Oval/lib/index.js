/**
 * oval => 椭圆素材
*/

import { filterObj } from '../../../../helpers/utils';
import { reap } from '../../../../components/SafeReaper';

export default props => {
  const { style } = props;

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
    <div style={{ width: '100%', height: '100%' }}>
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 600 240"
        style={{ width: '100%', height: '100%', ...data }}
      >
        <ellipse
          cx="300"
          cy="120"
          rx="240"
          ry="96"
          style={{
            stroke: borderColor,
            strokeWidth: borderWidth,
            fill: fillColor,
          }}
          // stroke="#24CBFF"
          // strokeWidth="0"
          // fill="#9000FF"
        ></ellipse>
      </svg>
    </div>
  );
};

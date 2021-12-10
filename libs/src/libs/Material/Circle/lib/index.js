import { reap } from '../../../../components/SafeReaper';
import { filterObj } from '../../../../helpers/utils';

/**
 * circle => 圆形素材
 */

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
    <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" style={{ ...data }}>
      <circle
        cx="50%"
        cy="50%"
        r="40%"
        style={{
          stroke: borderColor,
          strokeWidth: borderWidth,
          fill: fillColor,
        }}
        // stroke="#24CBFF"
        // strokeWidth="0"
        // fill="#9000FF"
      ></circle>
    </svg>
  );
};

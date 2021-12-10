import { filterObj } from "../../../../helpers/utils";
import { reap } from '../../../../components/SafeReaper';

/**
 * Right triangle => 直角三角形素材
 */

const RightTriangle = props => {
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
    <svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 300 200"
      // style="width: 100%; height: 100%;"
      style={{ width: '100%', height: '100%', ...data }}
    >
      <polygon
        points="30,180 270,180 30,20"
        style={{
          stroke: borderColor,
          strokeWidth: borderWidth,
          fill: fillColor,
        }}
        // stroke="#24CBFF"
        // stroke-width="0"
        // fill="#9000FF"
      ></polygon>
    </svg>
  );
};

export default RightTriangle;

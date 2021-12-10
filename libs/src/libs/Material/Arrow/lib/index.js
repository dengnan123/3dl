/**
 * Arrow => 箭头素材
 */

//
import { filterObj } from '../../../../helpers/utils';
import { reap } from '../../../../components/SafeReaper';

export default props => {
  const { style } = props;
  const _style = filterObj(style, ('', null, undefined));
  const rotation = reap(_style, 'rotate', 0);
  const opacity = reap(_style, 'opacity', 1);
  const fillColor = reap(_style, 'backgroundColor', '#9000FF');
  const newStyle = {
    opacity,
    transform: `rotate(${rotation}deg)`,
  };

  return (
    <svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      style={{ width: '100%', height: '100%', ...newStyle }}
    >
      <path
        d="M7.4 12.5l-3.6-3.5h12.2v-2h-12.2l3.6-3.5-1.5-1.4-5.9 5.9 5.9 5.9z"
        style={{ fill: fillColor }}
      ></path>
    </svg>
  );
};

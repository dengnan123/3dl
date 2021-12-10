/**
 * Rectangle => 矩形素材
 */

import { reap } from '../../../../components/SafeReaper';
import { filterObj } from '../../../../helpers/utils';

const Rectangle = props => {
  const { style, onChange, data = {} } = props;

  const _style = filterObj(style, ['', null, undefined]);
  const hShadow = reap(_style, 'hShadow', 0);
  const vShadow = reap(_style, 'vShadow', 0);
  const blur = reap(_style, 'blur', 0);
  const spread = reap(_style, 'spread', 0);
  const shadowColor = reap(_style, 'shadowColor', '#1991eb');
  delete _style['hShadow'];
  delete _style['vShadow'];
  delete _style['blur'];
  delete _style['spread'];
  delete _style['shadowColor'];
  const stylesObj = {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    ..._style,
    boxShadow: `${hShadow}px ${vShadow}px ${blur}px ${spread}px ${shadowColor}`,
    borderStyle: 'solid',
  };

  const itemClick = () => {
    onChange && onChange({ data });
  };

  return <div style={stylesObj} onClick={itemClick}></div>;
};

export default Rectangle;

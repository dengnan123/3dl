import PropTypes from 'prop-types';

import { parseSvgStr } from '../../helpers/utils';

import styles from './index.less';

const RenderSvg = props => {
  const { style, svgStr } = props;
  return (
    <div
      className={styles.icon}
      style={style}
      dangerouslySetInnerHTML={{ __html: parseSvgStr(svgStr) }}
    />
  );
};

RenderSvg.propTypes = {
  style: PropTypes.object,
  svgStr: PropTypes.string, //svg字符串
};

export default RenderSvg;

import PropTypes from 'prop-types';
import styles from './index.less';

const getSrc = (data, style) => {
  if (data.src) {
    return data.src;
  }
  return undefined;
};

const CustomizeSvg = props => {
  const { style, onChange, data } = props;
  const { svgStr = 'Svg' } = style || {};

  return (
    <div
      className={styles.icon}
      style={style}
      dangerouslySetInnerHTML={{ __html: getSrc(data) || svgStr }}
      onClick={() => {
        onChange && onChange();
      }}
    />
  );
};

CustomizeSvg.propTypes = {
  style: PropTypes.object,
};

export default CustomizeSvg;

import PropTypes from 'prop-types';
import styles from './index.less';

const Svg = props => {
  const { svgStr = 'Svg' } = props;

  return <div className={styles.icon} dangerouslySetInnerHTML={{ __html: svgStr }} />;
};

Svg.propTypes = {
  svgStr: PropTypes.string,
};

export default Svg;

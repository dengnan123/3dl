import PropTypes from 'prop-types';
import { getNameByLang } from '../../../helpers/lang';
import styles from './index.less';

const TitleBar = props => {
  const {
    style: {
      iconWith = 8,
      iconHeight = 14,
      iconMarginLeft = 0,
      iconMarginRight = 0,
      iconBgColor = '#1991eb',
      title = '我是标题',
      titleEn = 'I am title',
      fontSize = 16,
      color = '#000000',
    },
    lang = 'en-US',
  } = props;

  return (
    <div className={styles.titleBar}>
      <div
        className={styles.icon}
        style={{
          width: iconWith,
          height: iconHeight,
          marginLeft: iconMarginLeft,
          marginRight: iconMarginRight,
          backgroundColor: iconBgColor,
        }}
      />
      <div className={styles.title} style={{ fontSize: `${fontSize}px`, color }}>
        {getNameByLang(lang, title, titleEn)}
      </div>
    </div>
  );
};

TitleBar.propTypes = {
  style: PropTypes.object,
  lang: PropTypes.string,
};

export default TitleBar;

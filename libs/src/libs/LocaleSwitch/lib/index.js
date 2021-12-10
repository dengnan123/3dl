import PropTypes from 'prop-types';
import classnames from 'classnames';

import styles from './index.less';

const langEnum = {
  en: 'en-US',
  zh: 'zh-CN',
};

function LocaleSwitch(props) {
  const { onChange, lang = 'en-US', style } = props;
  const {
    fontSize = 12,
    fontWeight,
    color = '#000000',
    hilightColor = '#ffffff',
    hilightBgColor = '#1991eb',
    borderColor = '#d9d9d9',
    borderRadius = 4,
    edition = 'editionOne',
  } = style;

  const onClick = value => {
    onChange && onChange({ compKey: '', compValue: value });
  };

  const isEn = lang === langEnum.en;
  const isZh = lang === langEnum.zh;

  const ENStyle = {
    editionOne: {
      color: isEn ? hilightColor : color,
      backgroundColor: isEn ? hilightBgColor : 'unset',
      borderColor: isEn ? hilightBgColor : borderColor,
      borderRadius: `${borderRadius}px 0 0 ${borderRadius}px`,
    },
    editionTwo: {
      color: edition === 'editionTwo' ? '#000' : isEn ? hilightColor : color,
      fontWeight: isEn ? 800 : fontWeight,
      border: 'none',
    },
  };

  const CNStyle = {
    editionOne: {
      color: isZh ? hilightColor : color,
      backgroundColor: isZh ? hilightBgColor : 'unset',
      borderColor: isZh ? hilightBgColor : borderColor,
      borderRadius: `0 ${borderRadius}px ${borderRadius}px 0`,
    },
    editionTwo: {
      color: edition === 'editionTwo' ? '#000' : isZh ? hilightColor : color,
      fontWeight: isZh ? 800 : fontWeight,
      border: 'none',
    },
  };

  const Delimiter = {
    fontSize,
  };

  // console.log(ENStyle[edition], CNStyle[edition]);

  return (
    <div className={styles.group} style={{ fontSize: `${fontSize}px` }}>
      <div
        style={ENStyle[edition]}
        onClick={() => onClick(langEnum.en)}
        className={classnames(styles.btn, { [styles.active]: isEn })}
      >
        EN
      </div>
      {edition === 'editionTwo' && <div style={Delimiter[edition]}>/</div>}
      <div
        style={CNStyle[edition]}
        onClick={() => onClick(langEnum.zh)}
        className={classnames(styles.btn, { [styles.active]: isZh })}
      >
        中
      </div>
    </div>
  );
}

LocaleSwitch.propTypes = {
  data: PropTypes.object,
  style: PropTypes.object,
};

export default LocaleSwitch;

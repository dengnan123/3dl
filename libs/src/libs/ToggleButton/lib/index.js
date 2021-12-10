import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { getNameByLang } from '../../../helpers/lang';
import { Button } from 'antd';
import styles from './index.less';

const ToggleButton = props => {
  const {
    style: {
      content = '不平移',
      contentEn = 'not translate',
      invertContent = '平移',
      invertContentEn = 'translate',
      fontSize = 12,
      fontColor,
      borderRadius = 0,
      type = 'default',
      bgColor,
      showCustomColor,
    },
    onChange,
    lang = 'en-US',
  } = props;

  const [isTranslate, setIsTranslate] = useState(false);

  const onBtnClick = useCallback(() => {
    setIsTranslate(!isTranslate);
    // console.log({ isTranslate: !isTranslate });
    onChange && onChange({ isTranslate: !isTranslate });
  }, [isTranslate, onChange, setIsTranslate]);

  const btnStyle = { fontSize, color: fontColor, borderRadius };
  let btnProps = {};

  if (!showCustomColor) {
    btnProps['type'] = type;
  }
  if (showCustomColor) {
    btnStyle['backgroundColor'] = bgColor;
  }

  btnProps = { ...btnProps, style: btnStyle };

  return (
    <Button {...btnProps} className={styles.btn} onClick={onBtnClick}>
      {!isTranslate
        ? getNameByLang(lang, content, contentEn)
        : getNameByLang(lang, invertContent, invertContentEn)}
    </Button>
  );
};

ToggleButton.propTypes = {
  data: PropTypes.object,
  style: PropTypes.object,
  lang: PropTypes.string,
};

export default ToggleButton;

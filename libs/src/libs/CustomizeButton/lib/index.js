import PropTypes from 'prop-types';
import { useState } from 'react';
import { getNameByLang } from '../../../helpers/lang';
import { Button } from 'antd';
import styles from './index.less';
import { v4 } from 'uuid';
import { callBackStyle } from '../../../hooks/externalStyle';
import { isEmptyObj } from '../../../helpers/utils';

const CustomizeButton = props => {
  const {
    data = {},
    style: {
      content = '按钮',
      contentEn = 'button',
      fontSize = 12,
      fontColor = '#000000',
      borderWidth = 1,
      borderRadius = 0,
      type = 'default',
      bgColor = '#fff',
      borderColor = '#000000',
      boxShadow = 'none',
      padding = 16,
      textAlign = 'center',
      showCustomColor = false,
      clickedFontColor = '#fff',
      clickedBgColor = 'rgba(235,75,25,70)',
      clickedBorderColor = 'rgba(235,75,25,100)',
      compKey,
      compValue,
      openCbColor = false,
      backInitStyle = false,
      backTime = 250,
    },
    onChange,
    lang = 'zh-CN',
    loading,
  } = props;

  const [uuid] = useState(v4());
  const { colorScheme = {}, eventColorScheme = {} } = data;

  const onBtnClick = ({ id, config }) => {
    const {
      eventColorScheme,
      backInitStyle,
      backTime,
      btnStyle,
      clickedBgColor,
      clickedBorderColor,
    } = config;

    const _btn = document.getElementById(id);
    // 自定义按钮高亮设置
    if (openCbColor && showCustomColor) {
      !isEmptyObj(btnStyle) &&
        callBackStyle(btnStyle, _btn, {
          'background-color': clickedBgColor,
          'border-color': clickedBorderColor,
        });
      !isEmptyObj(eventColorScheme) && callBackStyle(btnStyle, _btn, eventColorScheme);

      if (backInitStyle) {
        setTimeout(() => {
          callBackStyle(btnStyle, _btn);
        }, backTime);
      }
    }
    console.log('CustomizeButton: ', { [compKey]: compValue });
    onChange && onChange({ [compKey]: compValue });
  };

  const btnStyle = { fontSize, color: fontColor, borderRadius, boxShadow };
  let btnProps = {};

  if (!showCustomColor) {
    btnProps['type'] = type;
  }
  if (showCustomColor) {
    btnStyle['background-color'] = bgColor;
    btnStyle['border'] = `${borderWidth}px solid ${borderColor}`;
    btnStyle['padding'] = `0 ${padding}px`;
    btnStyle['text-align'] = textAlign;
  }

  btnProps = { ...btnProps, style: { ...btnStyle, ...colorScheme } };

  return (
    <Button
      id={uuid}
      {...btnProps}
      className={styles.btn}
      onClick={onBtnClick.bind(null, {
        id: uuid,
        config: {
          eventColorScheme,
          backInitStyle,
          backTime,
          clickedBgColor,
          clickedBorderColor,
          btnStyle: { ...btnStyle, ...colorScheme },
        },
      })}
      loading={loading}
    >
      {getNameByLang(lang, content, contentEn)}
    </Button>
  );
};

CustomizeButton.propTypes = {
  data: PropTypes.object,
  style: PropTypes.object,
  lang: PropTypes.string,
};

export default CustomizeButton;

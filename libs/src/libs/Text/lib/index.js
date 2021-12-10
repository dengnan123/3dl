import React, { useCallback, useMemo } from 'react';
import { isString, isNumber, isObject } from 'lodash';
import { reap } from '../../../components/SafeReaper';
import { getNameByLang } from '../../../helpers/lang';

const TextLib = props => {
  // eslint-disable-next-line react/prop-types
  const { style = {}, height, lang = 'zh-CN', data, onChange } = props;
  const {
    text = '我是文本.',
    textEn = 'I am text',
    color,
    dynamicData = false,
    emptyText = '暂无数据',
    showDataChange = false,
    marginLeft = 5,
    marginRight = 5,
    upFontColor = '#ec6f59',
    downFontColor = '#23b899',
    textPosition = 'textLeft',
    formatter,
    disableLocalStorage = false,
    textIndent = 0,
    lineHeight,
  } = style;

  let _data = data || { value: emptyText };

  if (isObject(data)) {
    _data = { ...data };
  }

  if (isString(data) || isNumber(data)) {
    _data = { value: data };
  }

  if (_data.value === undefined || _data.value === null) {
    _data.value = emptyText;
  }

  // 提取数字
  const number = dynamicData
    ? Number(
        reap(_data, 'value', '')
          .toString()
          .replace(/[^\d|^\.|^\-]/g, ''),
      )
    : 0;

  let currentColor = _data.color || color;

  let currentBgColor = _data.backgroundColor || '';

  if (dynamicData && showDataChange) {
    if (number > 0) {
      currentColor = _data.color || upFontColor;
    }
    if (number < 0) {
      currentColor = _data.color || downFontColor;
    }
  }

  const _style = {
    ...style,
    color: currentColor,
  };
  if (currentBgColor) {
    _style.backgroundColor = currentBgColor;
  }

  if (height) {
    _style.height = `${height}px`;
    _style.lineHeight = `${style?.lineHeight ?? height}px`;
  }

  const onClick = useCallback(() => {
    onChange && onChange();
  }, [onChange]);

  const RenderTextValue = useMemo(() => {
    if (dynamicData) {
      return (
        <span>
          {showDataChange
            ? reap(_data, 'value', '')
                .toString()
                .replace('-', '')
            : reap(_data, 'value', '')}
        </span>
      );
    }
    let textValue = getNameByLang(lang, text, textEn);
    if (disableLocalStorage) {
      textValue = text;
    }
    return <span dangerouslySetInnerHTML={{ __html: textValue }} />;

    // return textValue
  }, [dynamicData, showDataChange, _data, disableLocalStorage, lang, text, textEn]);

  return (
    <>
      {textPosition === 'textRight' && (
        <div style={_style} className={style.container} onClick={onClick}>
          {showDataChange && number !== 0 ? (
            <span style={{ marginRight }}>{number > 0 ? '↑' : '↓'}</span>
          ) : null}
          {RenderTextValue}
          <span>{formatter}</span>
        </div>
      )}
      {textPosition === 'textLeft' && (
        <div style={_style} className={style.container} onClick={onClick}>
          {RenderTextValue}
          <span>{formatter}</span>
          {showDataChange && number !== 0 ? (
            <span style={{ marginLeft }}>{number > 0 ? '↑' : '↓'}</span>
          ) : null}
        </div>
      )}
    </>
  );
};

export default TextLib;

import React, { useEffect } from 'react';
import { v4 } from 'uuid';

function useDynamicStyle(eleId, selector, styleKey, styleValue) {
  useEffect(() => {
    const UUID = v4();
    const _head = document.head || document.getElementsByTagName('head')[0];
    const _targetEle = document.getElementById(eleId);
    const _sheetId = `style-${UUID}`;
    const _sheet = document.getElementById(_sheetId) || document.createElement('style');
    const className = `dynamicStyle-${UUID}`;
    _targetEle.classList.add(`${className}`);
    _sheet.id = _sheetId;
    _sheet.innerHTML += ` .${className} ${selector} {${styleKey}:${styleValue}}\n `;
    _head.appendChild(_sheet);

    return () => {
      _head.removeChild(_sheet);
      _targetEle.classList.remove(`${className}`);
    };
  }, [eleId, selector, styleKey, styleValue]);
}

export default useDynamicStyle;

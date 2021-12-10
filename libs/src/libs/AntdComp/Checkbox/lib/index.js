import { useCallback, useEffect, useRef } from 'react';
import { useSetState, useDeepCompareEffect } from 'react-use';
import { v4 as uuidv4 } from 'uuid';
import { useDomStyle } from '../../../../helpers/utils';
import { Checkbox as AntdCheckbox } from 'antd';

function Checkbox(props) {
  const { onChange, style } = props;
  const [{ checked, id }, setState] = useSetState({ checked: false, id: `checkbox-${uuidv4()}` });
  const {
    label = 'Apple',
    checked: propsChecked,
    antCheckboxInnerStyle,
    antCheckboxInnerCheckedStyle,
    labelStyle,
    labelCheckedStyle,
  } = style || {};

  const onChangeRef = useRef();
  onChangeRef.current = onChange;

  const handleChange = useCallback(
    e => {
      const checked = e.target.checked;
      setState({ checked });
    },
    [setState],
  );

  useDeepCompareEffect(() => {
    setState({ checked });
  }, [propsChecked, setState]);

  // 往上抛数据
  useEffect(() => {
    onChangeRef.current && onChangeRef.current({ checked });
  }, [checked]);

  // 设置样式
  useDomStyle(`#${id} .ant-checkbox-inner`, antCheckboxInnerStyle, !checked);
  useDomStyle(`#${id} .ant-checkbox-inner`, antCheckboxInnerCheckedStyle, checked);

  return (
    <div id={id}>
      <AntdCheckbox style={checked ? labelStyle : labelCheckedStyle} onChange={handleChange}>
        {label}
      </AntdCheckbox>
    </div>
  );
}

export default Checkbox;

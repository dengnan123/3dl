import React, { useEffect, useState } from 'react';
import { Form } from 'antd';
import { merge } from 'lodash';
import { filterObj } from '../../../../helpers/utils';
import { parseConfigToEcharts, parseEchartsToConfig } from '../../parse/XAxis';
import Axis from '../Axis';

import styles from './index.less';

const XAxis = props => {
  const { style, form, formItemLayout } = props;

  const [data, setData] = useState({});

  useEffect(() => {
    const newData = parseEchartsToConfig(style.xAxis);

    setData(newData);
  }, [style, setData]);

  const axisProps = {
    form,
    formItemLayout,
    data,
    type: 'X',
  };


  return (
    <div className={styles.textDiv}>
      <Axis {...axisProps}></Axis>
    </div>
  );
};

export default Form.create({
  onFieldsChange: (props, changedFields) => {
    const {
      form: { getFieldsValue },
      updateStyle,
      style,
    } = props;

    const newFields = getFieldsValue();
    const _sty = filterObj(newFields, [undefined, '', null]);
    let finlData = parseConfigToEcharts(_sty);
    updateStyle({
      ...style,
      xAxis: merge({}, style.xAxis, finlData),
    });
  },
})(XAxis);

import React, { useEffect, useState } from 'react';
import { Form } from 'antd';
import { merge } from 'lodash';
import { filterObj } from '../../../../helpers/utils';
import { parseConfigToEcharts, parseEchartsToConfig } from '../../parse/XAxis';
import styles from './index.less';
import Axis from '../Axis';

const YAxis = props => {
  const { style, form, formItemLayout } = props;

  const [data, setData] = useState({});
  useEffect(() => {
    const newData = parseEchartsToConfig(style.yAxis);
    setData(newData);
  }, [style, setData]);


  const axisProps = {
    form,
    formItemLayout,
    data,
    type: 'Y',
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
      yAxis: merge({}, style.yAxis, finlData),
    });
  },
})(YAxis);

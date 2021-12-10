import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Form, Select } from 'antd';

import { formatQueryData } from '@/helpers/database';

function CommonEchart(props) {
  const {
    form: { getFieldDecorator, getFieldValue },
    data,
    queryData,
    formItemLayout,
    xColumnFieldKey = 'xColumn',
    yColumnFieldKey = 'yColumn',
    groupByFieldKey = 'groupBy',
    itemProps = {},
  } = props;

  const compName = data?.compName;

  const xColumn = getFieldValue(xColumnFieldKey);
  const yColumn = getFieldValue(yColumnFieldKey);
  const groupBy = getFieldValue(groupByFieldKey);

  const finalData = useMemo(() => {
    return formatQueryData({
      queryData,
      xColumn,
      yColumn,
      groupBy,
      compName,
    });
  }, [queryData, xColumn, yColumn, groupBy, compName]);

  console.log('finalData', finalData);
  console.log('compName', compName);

  // 下拉列表
  const { xColumnList, yColumnList, groupByList } = useMemo(() => {
    const columns = queryData?.columns || [];
    const xColumnList =
      columns?.filter(n => ![...(yColumn || []), groupBy].includes(n?.name ?? '')) || [];
    const yColumnList = columns?.filter(n => ![xColumn, groupBy].includes(n?.name ?? '')) || [];
    const groupByList =
      columns?.filter(n => ![...(yColumn || []), xColumn].includes(n?.name ?? '')) || [];

    return { xColumnList, yColumnList, groupByList };
  }, [queryData, xColumn, yColumn, groupBy]);

  return (
    <>
      <Form.Item label="xColumn" {...formItemLayout} {...(itemProps?.xColumn || {})}>
        {getFieldDecorator(xColumnFieldKey, {
          initialValue: data?.[xColumnFieldKey],
          rules: [{ required: true, message: '请选择表格列' }],
        })(
          <Select placeholder="xColumn" style={{ width: '100%' }}>
            {xColumnList?.map(n => (
              <Select.Option key={n?.name} value={n?.name}>
                {n?.name}
              </Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item label="yColumn" {...formItemLayout} {...(itemProps?.yColumn || {})}>
        {getFieldDecorator(yColumnFieldKey, { initialValue: data?.[yColumnFieldKey] })(
          <Select placeholder="yColumn" mode="multiple" style={{ width: '100%' }}>
            {yColumnList?.map(n => (
              <Select.Option key={n?.name} value={n?.name}>
                {n?.name}
              </Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>

      <Form.Item label="groupBy" {...formItemLayout} {...(itemProps?.groupBy || {})}>
        {getFieldDecorator(groupByFieldKey, { initialValue: data?.[groupByFieldKey] })(
          <Select placeholder="groupBy" style={{ width: '100%' }}>
            {groupByList?.map(n => (
              <Select.Option key={n?.name} value={n?.name}>
                {n?.name}
              </Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>
    </>
  );
}

CommonEchart.propTypes = {
  form: PropTypes.object,
  data: PropTypes.object,
  queryData: PropTypes.object,
  formItemLayout: PropTypes.object,
};

export default CommonEchart;

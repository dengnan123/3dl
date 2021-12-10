import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Form, Select } from 'antd';
import ColumnFieldsSelect from './items/ColumnFieldsSelect';

function AntdTable(props) {
  const {
    form: { getFieldDecorator },
    data,
    queryData,
    formItemLayout,
    columnsFieldKey = 'fields',
    groupByFieldKey = 'groupBy',
    itemProps = {},
  } = props;

  // 下拉列表
  const { columnList, groupByList } = useMemo(() => {
    const columnList = queryData?.columns || [];
    const groupByList = columnList || [];

    return { columnList, groupByList };
  }, [queryData]);

  return (
    <>
      <Form.Item label="fields" {...formItemLayout} {...(itemProps?.fields || {})}>
        {getFieldDecorator(columnsFieldKey, {
          initialValue: data?.[columnsFieldKey],
        })(<ColumnFieldsSelect columnList={columnList} />)}
      </Form.Item>

      <Form.Item label="groupBy" {...formItemLayout} {...(itemProps?.groupBy || {})}>
        {getFieldDecorator(groupByFieldKey, { initialValue: data?.[groupByFieldKey] })(
          <Select placeholder="groupBy" mode="multiple" style={{ width: '100%' }}>
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

AntdTable.propTypes = {
  form: PropTypes.object,
  data: PropTypes.object,
  queryData: PropTypes.object,
  formItemLayout: PropTypes.object,
};

export default AntdTable;

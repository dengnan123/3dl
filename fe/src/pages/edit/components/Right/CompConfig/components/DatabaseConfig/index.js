import React, { useCallback } from 'react';
import { getAllDataSource } from '@/service';
import { useDoApi } from '@/hooks/apihost';
import { getParseSearch } from '@/helpers/utils';
import { useUpdateState } from '@/hooks';
import { QueryData } from './temp';
import { Form, Select } from 'antd';
import { DatabaseConfigItem } from '@/components';

import styles from './index.less';

const { CommonEchart, AntdTable } = DatabaseConfigItem;

const ConfigByCompNameEnum = {
  Bar: CommonEchart,
  Line: CommonEchart,
  LineAndBar: CommonEchart,
  Pie: CommonEchart,
  AntdTable,
};

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};

const DatabaseConfig = props => {
  const {
    form,
    form: { getFieldDecorator },
    data,
  } = props;
  const { pageId, tagId } = getParseSearch();

  const [{ queryData }, updateState] = useUpdateState({
    queryData: QueryData,
  });

  const { state } = useDoApi(getAllDataSource, true, {
    pageId,
    tagId,
    isEdit: true,
  });
  const dataSourceList = state?.value?.data || [];

  const compName = data?.compName;

  const handleDataSourceIdChange = useCallback(v => {}, []);

  console.log('dataSourceList', dataSourceList);

  const ConfigComp = ConfigByCompNameEnum[compName];

  const configCompProps = { form, formItemLayout, queryData, data };

  return (
    <section className={styles.container}>
      <Form.Item label="数据源" {...formItemLayout}>
        {getFieldDecorator('dataSourceId', { initialValue: data?.dataSourceId })(
          <Select placeholder="sql" onChange={handleDataSourceIdChange}>
            {dataSourceList?.map(n => (
              <Select.Option key={n?.id} value={n?.id}>
                {n?.dataSourceName}
              </Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      {ConfigComp && <ConfigComp {...configCompProps} />}
    </section>
  );
};

export default DatabaseConfig;

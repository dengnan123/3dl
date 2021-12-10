import React from 'react';
import { Form } from 'antd';
import { reap } from '@/components/SafeReaper';
import styles from './index.less';
import AceEditor from '@/components/AceEditor';
import { getData } from '@/helpers/screen';

const DataConfig = props => {
  const {
    form: { getFieldDecorator },
    data,
    staticData,
  } = props;

  const editProps = {
    language: 'json',
    showFooter: false,
    titleFiledArr: [],
  };

  let mockData = reap(data, 'mockData', {});
  const _code = getData({
    mockData,
    staticData,
  });

  const initialValue = JSON.stringify(_code, null, 2);
  return (
    <div className={styles.apiConfig}>
      <Form.Item label="" layout="vertical">
        {getFieldDecorator('mockData', {
          initialValue,
        })(<AceEditor {...editProps} />)}
      </Form.Item>
    </div>
  );
};

export default DataConfig;

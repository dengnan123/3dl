import React from 'react';

import AceEditor from '@/components/AceEditor';
import { getData } from '@/helpers/screen';
import styles from './index.less';

const EditJsonDataConfig = props => {
  const {
    form: { setFieldsValue },
    // data,
    staticData,
    initMockData,
  } = props;

  const _code = getData({
    mockData: initMockData,
    staticData,
  });

  const onCodeChange = code => {
    setFieldsValue({ mockData: code });
  };

  // const initialValue = JSON.stringify(_code, null, 2);

  const editProps = {
    language: 'json',
    showFooter: false,
    titleFiledArr: [],
    value: _code,
    onChange: onCodeChange,
  };

  return (
    <div className={styles.apiConfig}>
      {/* <Form.Item label="" layout="vertical">
        {getFieldDecorator('mockData', {
          initialValue,
        })(<AceEditor {...editProps} />)}
      </Form.Item> */}
      <AceEditor {...editProps} />
    </div>
  );
};

export default EditJsonDataConfig;

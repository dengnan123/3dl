import { useState } from 'react';
import PropTypes from 'prop-types';

import ApiConfig from '../ApiConfig';

import styles from './index.less';

function StaticDataConfig(props) {
  const { form, data, staticData, dataSourceList } = props;

  return (
    <div className={styles.container}>
      <div className={styles.left}></div>
      <div className={styles.right}>
        <ApiConfig
          form={form}
          data={data}
          staticData={staticData}
          dataSourceList={dataSourceList}
        />
      </div>
    </div>
  );
}

StaticDataConfig.propTypes = {
  form: PropTypes.object,
  data: PropTypes.object,
  staticData: PropTypes.object,
  dataSourceList: PropTypes.array,
};

export default StaticDataConfig;

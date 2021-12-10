import PropTypes from 'prop-types';
import JsonConfig from '../JsonConfig';

import styles from './index.less';

function JsonDataConfig(props) {
  const { form, data, staticData } = props;

  return (
    <div className={styles.container}>
      <div className={styles.right}>
        <JsonConfig form={form} data={data} staticData={staticData} />
      </div>
    </div>
  );
}

JsonDataConfig.propTypes = {
  form: PropTypes.object,
  data: PropTypes.object,
  staticData: PropTypes.object,
};

export default JsonDataConfig;

import PropTypes from 'prop-types';
import ExcelConfig from '../ExcelConfig';

import styles from './index.less';

function ExcelDataConfig(props) {
  const { form, data, staticData } = props;

  return (
    <div className={styles.container}>
      {/* <div className={styles.left}>list</div> */}
      <div className={styles.right}>
        <ExcelConfig propsForm={form} data={data} staticData={staticData} />
      </div>
    </div>
  );
}

ExcelDataConfig.propTypes = {
  form: PropTypes.object,
  data: PropTypes.object,
  staticData: PropTypes.object,
};

export default ExcelDataConfig;

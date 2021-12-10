import PropTypes from 'prop-types';
import { getCompConfig } from '@/helpers/screen';
import { omit } from 'lodash';
import { Form, Empty } from 'antd';

import styles from './index.less';

const CompStyleConfig = props => {
  const { selectedCompInfo } = props;

  const configProps = omit(props, ['form']);

  if (!selectedCompInfo) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return <div className={styles.panel}>{getCompConfig(configProps)}</div>;
};

CompStyleConfig.propTypes = {
  form: PropTypes.object,
  formItemLayout: PropTypes.object,
  selectedCompInfo: PropTypes.object,
};

export default Form.create()(CompStyleConfig);

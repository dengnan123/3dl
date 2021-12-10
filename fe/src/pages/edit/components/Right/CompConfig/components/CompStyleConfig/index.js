import { getCompConfig } from '@/helpers/screen';
import { omit } from 'lodash';
import { Form, Switch } from 'antd';
import ModalCodeEdit from '@/components/ModalCodeEdit';

import styles from './index.less';

const CompStyleConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator },
    form,
    isSelectCompInfo,
  } = props;
  const openHighConfig = isSelectCompInfo?.style?.openHighConfig;
  const highConfigProps = {
    form,
    formItemLayout,
    field: 'styleFilterFunc',
    data: isSelectCompInfo?.style,
    formLabel: '过滤器',
    btnText: '点击设置',
  };
  const configProps = omit(props, ['form']);
  return (
    <div style={{ padding: '0 10px' }} className={styles.compStyles}>
      {getCompConfig(configProps)}
      <Form.Item label="高级" {...formItemLayout}>
        {getFieldDecorator('openHighConfig', {
          initialValue: openHighConfig,
          valuePropName: 'checked',
        })(<Switch />)}
      </Form.Item>
      {openHighConfig ? <ModalCodeEdit {...highConfigProps}></ModalCodeEdit> : null}
    </div>
  );
};

export default Form.create({
  onFieldsChange: (props, changedFields) => {
    const {
      form: { getFieldsValue },
      attributeUpdate,
      isSelectCompInfo,
    } = props;
    const { id, style } = isSelectCompInfo;
    const newFields = getFieldsValue();
    if (!newFields || JSON.stringify(newFields) === '{}') {
      return;
    }
    attributeUpdate({
      id,
      data: {
        style: {
          ...style,
          ...newFields,
        },
      },
    });
  },
})(CompStyleConfig);

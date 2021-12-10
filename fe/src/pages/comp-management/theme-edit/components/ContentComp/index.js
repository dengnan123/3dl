import React from 'react';
import PropTypes from 'prop-types';
import { Form, Empty, InputNumber } from 'antd';
import PurCompLib from '@/components/PurCompLib';
import { InputColor } from '@/components/index';

import styles from './index.less';

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

function ContentComp(props) {
  const { form, compInfo } = props;
  const { getFieldDecorator, getFieldsValue } = form;
  const compName = compInfo?.compName;
  const style = compInfo?.style || {};
  const data = compInfo?.mockData || {};

  const contentBoxStyle = getFieldsValue();

  return (
    <section className={styles.content}>
      <div className={styles.top}>
        <span className={styles.compName}>{compInfo?.label}</span>
        <Form.Item label="宽度" {...formItemLayout}>
          {getFieldDecorator('width', { initialValue: 700 })(
            <InputNumber placeholder="请输入宽度" min={0} />,
          )}
        </Form.Item>
        <Form.Item label="高度" {...formItemLayout}>
          {getFieldDecorator('height', { initialValue: 500 })(
            <InputNumber placeholder="请输入高度" min={0} />,
          )}
        </Form.Item>
        <Form.Item label="背景色" {...formItemLayout}>
          {getFieldDecorator('backgroundColor')(<InputColor />)}
        </Form.Item>
      </div>

      <div className={styles.center}>
        {compName ? (
          <div className={styles.compContainer} style={contentBoxStyle}>
            <div className={styles.canvas} id={compName}>
              <PurCompLib
                compName={compName}
                width={contentBoxStyle?.width}
                height={contentBoxStyle?.height}
                style={style}
                data={data}
              />
            </div>
          </div>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
    </section>
  );
}

ContentComp.propTypes = {
  form: PropTypes.object,
  compInfo: PropTypes.object,
};

export default Form.create()(ContentComp);

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, InputNumber, Icon, Input, Button, Row, Col } from 'antd';
import { debounce } from 'lodash';
// import InputColor from '../../../components/InputColor';
// import CustomizeColor from '../../../components/CustormizeColor/formItem';

// const { Panel } = Collapse;
import styles from './index.less';

const FormItem = Form.Item;
function KinectConfig(props) {
  const {
    form: { getFieldDecorator, getFieldValue, setFieldsValue, resetFields },
    style,
  } = props;
  const { range = [] } = style;

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields]);

  const initialRangeGroup = range || [];

  getFieldDecorator('rangeGroup', {
    initialValue: initialRangeGroup,
  });
  const newRangeGroup = getFieldValue('rangeGroup');

  const handleButtonRemove = curIndex => {
    const newRangeGroup = getFieldValue('rangeGroup').filter((n, index) => index !== curIndex);
    setFieldsValue({ rangeGroup: newRangeGroup });
  };

  const handleButtonAdd = () => {
    const newRangeGroup = getFieldValue('rangeGroup') || [];
    newRangeGroup.push({ key: '', max: 1, min: 0 });
    setFieldsValue({ rangeGroup: newRangeGroup });
  };

  return (
    <div style={{ textAlign: 'left' }}>
      <FormItem label="IP">
        {getFieldDecorator('IP', {
          initialValue: style?.IP || 'localhost',
        })(<Input />)}
      </FormItem>
      {newRangeGroup.map((item, index) => {
        return (
          <div className={styles.legendItem} key={index}>
            <Row>
              <Col span={17}>数值范围{index + 1}</Col>
              <Col span={7} style={{ textAlign: 'right' }}>
                {newRangeGroup.length > 1 && (
                  <Icon type="minus-circle" onClick={() => handleButtonRemove(index)} />
                )}
              </Col>
            </Row>
            <Form.Item>
              {getFieldDecorator(`range[${index}].key`, {
                initialValue: item.key,
              })(<Input placeholder="key" />)}
            </Form.Item>
            <p>范围数值：</p>
            <Row>
              <Col span={11}>
                <Form.Item>
                  {getFieldDecorator(`range[${index}].min`, {
                    initialValue: item.min,
                  })(<InputNumber placeholder="最小值" min={0} />)}
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item>
                  {getFieldDecorator(`range[${index}].max`, {
                    initialValue: item.max,
                  })(<InputNumber placeholder="最大值" min={0} />)}
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item>
                  {getFieldDecorator(`range[${index}].time`, {
                    initialValue: item.time,
                  })(<InputNumber placeholder="多长时间后触发" min={0} />)}
                </Form.Item>
              </Col>
            </Row>
          </div>
        );
      })}
      <div>
        <Button onClick={handleButtonAdd}>添加范围</Button>
        <p className={styles.tips}>请保持范围唯一，且区间为左开右闭！</p>
      </div>
    </div>
  );
}

KinectConfig.propTypes = {
  updateStyle: PropTypes.func,
  form: PropTypes.object,
};

export default Form.create({
  onFieldsChange: debounce((props, changedFields) => {
    const {
      form: { getFieldsValue },
      style,
      updateStyle,
    } = props;
    const newFields = getFieldsValue();
    delete newFields['rangeGroup'];
    // 处理数据
    updateStyle({
      ...style,
      ...newFields,
    });
  }, 500),
})(KinectConfig);

import React, { useState, Fragment } from 'react';
import { Form, Modal, Button, InputNumber, Select, Row, Col } from 'antd';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 9,
  },
  wrapperCol: {
    span: 15,
  },
};

export default props => {
  const {
    // form: { setFieldsValue, getFieldDecorator, getFieldValue },
    form: { getFieldDecorator },
    data,
    label,
    isRight,
  } = props;

  const [vis, setVis] = useState(false);

  const handleCancel = () => {
    setVis(false);
  };

  const isSetting = data && JSON.stringify(data) !== '{}';

  return (
    <Fragment>
      <FormItem {...formItemLayout}>
        <Button
          type="primary"
          onClick={() => {
            setVis(true);
          }}
          size={'small'}
        >
          设置
        </Button>
        {isSetting && <span style={{ color: '#61e81e', marginLeft: 10 }}>已设置</span>}
      </FormItem>

      <Modal
        visible={vis}
        footer={null}
        onCancel={handleCancel}
        width={850}
        // destroyOnClose={true}
        maskClosable={false}
        title={isRight ? '右滑配置' : '左滑配置'}
        // mask={false}
      >
        {vis && (
          <>
            <Row>
              <Col span={8}>
                <FormItem label="距离左侧宽度" {...formItemLayout}>
                  {getFieldDecorator(`${label}.lastWidth`, {
                    initialValue: data?.lastWidth,
                  })(<InputNumber placeholder="" style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem label="" {...formItemLayout}>
                  {getFieldDecorator(`${label}.widthUnit`, {
                    initialValue: data?.widthUnit || '%',
                  })(
                    <Select style={{ width: 120, marginLeft: 10 }} placeholder="选择单位">
                      <Select.Option value="%">%</Select.Option>
                      <Select.Option value="px">px</Select.Option>
                    </Select>,
                  )}
                </FormItem>
              </Col>
            </Row>
          </>
        )}
      </Modal>
    </Fragment>
  );
};

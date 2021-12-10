import React, { useState } from 'react';
import { Form, Row, Col, Input, Button, Upload, Icon } from 'antd';

import styles from './index.less';

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 20 },
};

function AddCodeForm(props) {
  const {
    form: { getFieldDecorator, validateFields },
    onOk,
    onClose,
  } = props;

  const [linearFiles, setLinearFiles] = useState([]);
  const [solidFiles, setSolidFiles] = useState([]);

  const onSubmitConfirm = () => {
    validateFields((errors, values) => {
      if (errors) {
        return;
      }
      console.log(values, '====values');
      onOk && onOk(values);
    });
  };

  const handlePreview = file => {
    // console.log(file, 'f==preview');
  };

  const beforeUpload = (file, files, type) => {
    // console.log(file, 'f==before');
  };

  const handleChange = ({ fileList, file, event }, type) => {
    const { status } = file;

    let resultList = fileList;

    if (status === 'done') {
    }

    if (status === 'removed') {
    }
    // console.log(resultList, 'f==resultList');
    if (type && type === 'linear') {
      setLinearFiles(resultList);
      return;
    }
    setSolidFiles(resultList);
  };

  return (
    <div className={styles.dContent}>
      <Form>
        <Form.Item {...formItemLayout} label="Code">
          {getFieldDecorator('code', {
            rules: [
              {
                whitespace: true,
                required: true,
                message: '请输入code',
              },
            ],
          })(<Input placeholder="请输入code（不可输入已存在的code）" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="名称">
          {getFieldDecorator('name', {
            rules: [
              {
                whitespace: true,
                required: true,
                message: '请输入对应SVG名称',
              },
            ],
          })(<Input placeholder="请输入对应SVG名称" addonAfter=".svg" />)}
        </Form.Item>
        <Row className={styles.rowItem}>
          <Col span={12}>
            <h4>线性SVG图</h4>
            <Upload
              accept="image/svg+xml"
              // headers={{ Authorization: '' }}
              // action={'/list/file'}
              listType="picture-card"
              beforeUpload={(file, files) => beforeUpload(file, files)}
              onPreview={handlePreview}
              onChange={fileInfo => handleChange(fileInfo, 'linear')}
            >
              {linearFiles.length ? null : (
                <div>
                  <Icon type="plus" />
                  <div className="ant-upload-text">Upload</div>
                </div>
              )}
            </Upload>
          </Col>

          <Col span={12}>
            <h4>实心SVG图</h4>
            <Upload
              accept="image/svg+xml"
              headers={{ Authorization: '' }}
              action={'/list/file'}
              listType="picture-card"
              beforeUpload={(file, files) => beforeUpload(file, files)}
              onPreview={handlePreview}
              onChange={fileInfo => handleChange(fileInfo)}
            >
              {solidFiles.length ? null : (
                <div>
                  <Icon type="plus" />
                  <div className="ant-upload-text">Upload</div>
                </div>
              )}
            </Upload>
          </Col>
        </Row>
      </Form>
      <div className={styles.footer}>
        <Button style={{ marginRight: 10 }} onClick={onClose}>
          取消
        </Button>
        <Button type="primary" onClick={onSubmitConfirm}>
          保存
        </Button>
      </div>
    </div>
  );
}

AddCodeForm.propTypes = {};

export default Form.create()(AddCodeForm);

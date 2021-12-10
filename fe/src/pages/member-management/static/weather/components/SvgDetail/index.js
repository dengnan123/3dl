import React, { useState } from 'react';
import { Form, Row, Col, Input, Divider, Button, Upload, Icon } from 'antd';

import styles from './index.less';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

function SvgDetail(props) {
  const {
    form: { getFieldDecorator, validateFields },
    info,
    onOk,
    onClose,
  } = props;
  const { name = '', linearPath, solidPath } = info;

  const [linearFiles, setLinearFiles] = useState([]);
  const [solidFiles, setSolidFiles] = useState([]);

  const currentName = name.split('.svg')[0];

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
      <Row>
        <Col span={12}>
          <h3>线性svg</h3>
          <p className={styles.imgContent}>
            <img src={linearPath} alt="" />
          </p>
        </Col>

        <Col span={12}>
          <h3>实心svg</h3>
          <p className={styles.imgContent}>
            <img src={solidPath} alt="" />
          </p>
        </Col>
      </Row>
      <Divider />
      <Form>
        <Form.Item {...formItemLayout} label="名称">
          {getFieldDecorator('name', {
            initialValue: currentName,
            rules: [
              {
                required: true,
                message: '请输入对应SVG名称',
              },
            ],
          })(<Input placeholder="请输入对应SVG名称" addonAfter=".svg" />)}
        </Form.Item>
        <Row>
          <Col span={12}>
            <h4>线性图</h4>
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
            <h4>实心图</h4>
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

SvgDetail.propTypes = {};

export default Form.create()(SvgDetail);

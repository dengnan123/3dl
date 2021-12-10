import React from 'react';
import { Form, Input, Button, Select, Row, Col, Switch } from 'antd';

import { API_HOST } from '../../../../../config';
import InputColor from '@/components/InputColor';
import UploadImg from '@/components/UploadImg';
import UploadFile from '@/components/UploadFile';
import styles from './index.less';

const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;

// const formItemLayout = {
//   labelCol: { span: 8 },
//   wrapperCol: { span: 16 },
// };

const PageBaseConfig = props => {
  const {
    config,
    pageId,
    resetFont,
    form: { getFieldDecorator },
  } = props;

  const {
    name,
    description,
    pageWidth,
    pageHeight,
    bgc,
    type,
    bgi,
    pageCoverImg,
    fontFamily,
    openLazyLoading,
  } = config || {};

  const fileds = [
    {
      label: '名称',
      field: 'name',
      fieldType: 'String',
      Comp: TextArea,
      initValue: name,
    },

    {
      label: '描述',
      field: 'description',
      fieldType: 'String',
      Comp: TextArea,
      initValue: description,
    },
  ];

  const uploadImgProps = {
    API_HOST,
    pageId,
    action: `${API_HOST}/page/upload`,
    data: {
      id: pageId,
      saveKey: 'bgi',
      fileType: 'pic',
    },
  };

  const uploadFileProps = {
    API_HOST,
    pageId,
    action: `${API_HOST}/page/upload`,
    clickText: '上传字体',
    data: {
      id: pageId,
      saveKey: 'fontFamily',
      fileType: 'fonts',
    },
  };

  const uploadPagePicProps = {
    API_HOST,
    pageId,
    action: `${API_HOST}/page/upload`,
    data: {
      id: pageId,
      saveKey: 'pageCoverImg',
      fileType: 'pic',
    },
  };

  return (
    <React.Fragment>
      <FormItem label="开启懒加载" className={styles.lazyLoadingItem}>
        {getFieldDecorator('openLazyLoading', {
          valuePropName: 'checked',
          initialValue: openLazyLoading,
        })(<Switch />)}
      </FormItem>

      {fileds.map(v => {
        const { label, field, fieldType, Comp, initValue } = v;
        return (
          <FormItem label={label} key={field}>
            {getFieldDecorator(field, {
              initialValue: initValue,
            })(<Comp type={fieldType} />)}
          </FormItem>
        );
      })}
      <Row className={styles.itemRows}>
        <Col span={12}>
          <FormItem label="屏宽">
            {getFieldDecorator('pageWidth', {
              initialValue: pageWidth,
            })(<Input type="Number" />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="屏高">
            {getFieldDecorator('pageHeight', {
              initialValue: pageHeight,
            })(<Input type="Number" />)}
          </FormItem>
        </Col>
      </Row>

      <Row className={styles.itemRows}>
        <Col span={24}>
          <FormItem label="背景颜色">
            {getFieldDecorator('bgc', {
              initialValue: bgc,
            })(<InputColor />)}
          </FormItem>
        </Col>
      </Row>

      <Row className={styles.itemRows}>
        <Col span={24}>
          <FormItem label="页面展示方式">
            {getFieldDecorator('type', {
              initialValue: type,
            })(
              <Select>
                <Option value="allSpread">大屏展示全铺满</Option>
                <Option value="widthSpread">宽度等比缩放高度铺满</Option>
                <Option value="default">默认不处理</Option>
                {/* <Option value="heightSpread">等比缩放高度铺满</Option> */}
              </Select>,
            )}
          </FormItem>
        </Col>
      </Row>

      <Row className={styles.itemRows}>
        <Col span={12}>
          <FormItem label="上传背景图">
            {getFieldDecorator('bgi', {
              initialValue: bgi,
            })(<UploadImg {...uploadImgProps} />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="上传封面">
            {getFieldDecorator('pageCoverImg', {
              initialValue: pageCoverImg,
            })(<UploadImg {...uploadPagePicProps} />)}
          </FormItem>
        </Col>
      </Row>

      <Row className={styles.itemRows}>
        <Col span={12}>
          <FormItem label="">
            {getFieldDecorator('fontFamily', {
              initialValue: fontFamily,
            })(<UploadFontFile {...uploadFileProps} />)}
          </FormItem>
        </Col>
        <Col span={12}>
          <Button onClick={resetFont}>重置字体</Button>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default PageBaseConfig;

class UploadFontFile extends React.Component {
  render() {
    const onChange = data => {
      this.props.onChange(data.bgi);
    };
    const uploadProps = {
      ...this.props,
      onChange,
    };

    return <UploadFile {...uploadProps}></UploadFile>;
  }
}

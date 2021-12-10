import React from 'react';
import PropTypes from 'prop-types';
import { Form, Switch, InputNumber, Collapse } from 'antd';
import { debounce } from 'lodash';
import defaultConig from '../styles';
import InputColor from '../../../components/InputColor';
import { styles } from 'ansi-colors';
import CodeEditForm from '../../../components/CodeEditForm';
import { Config as PaginationConfig } from '../../Pagination/config';
const { Panel } = Collapse;

function Config(props) {
  const {
    formItemLayout,
    form: { getFieldDecorator },
    style,
  } = props;
  const {
    showBorder = defaultConig['showBorder'],
    BorderColor = defaultConig['BorderColor'],
    boxPadding = defaultConig['boxPadding'],
    showBackground = defaultConig['showBackground'],
    background = defaultConig['background'],
    BorderRaduis = defaultConig['BorderRaduis'],

    pagination = defaultConig['pagination'],
    defaultCurrentPage = defaultConig['defaultCurrentPage'],
    pageSize = defaultConig['pageSize'],

    cellRowStyle = defaultConig['cellRowStyle'],
    cellColumnStyle = defaultConig['cellColumnStyle'],
    cellMatrixStyle = defaultConig['cellMatrixStyle'],
  } = style;
  return (
    <div>
      <Collapse>
        <Panel header={'基础样式'}>
          <Form.Item label="是否显示边框" {...formItemLayout}>
            {getFieldDecorator('showBorder', {
              initialValue: showBorder,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          {showBorder && (
            <>
              <Form.Item label="边框颜色" {...formItemLayout}>
                {getFieldDecorator('BorderColor', {
                  initialValue: BorderColor,
                })(<InputColor />)}
              </Form.Item>
            </>
          )}

          <Form.Item label="圆角" {...formItemLayout}>
            {getFieldDecorator('BorderRaduis', {
              initialValue: BorderRaduis,
            })(<InputNumber />)}
          </Form.Item>

          <Form.Item label="内边距" {...formItemLayout} className={styles.line}>
            {getFieldDecorator('boxPadding', {
              initialValue: boxPadding,
            })(<InputNumber />)}
          </Form.Item>

          <Form.Item label="是否显示背景色" {...formItemLayout} className={styles.line}>
            {getFieldDecorator('showBackground', {
              initialValue: showBackground,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>
          {showBackground && (
            <>
              <Form.Item label="背景色" {...formItemLayout}>
                {getFieldDecorator('background', {
                  initialValue: background,
                })(<InputColor />)}
              </Form.Item>
            </>
          )}
        </Panel>
        <Panel header={'样式设置'}>
          <Form.Item label="行样式">
            {getFieldDecorator('cellRowStyle', {
              initialValue: cellRowStyle,
            })(<CodeEditForm />)}
          </Form.Item>
          <Form.Item label="列样式">
            {getFieldDecorator('cellColumnStyle', {
              initialValue: cellColumnStyle,
            })(<CodeEditForm />)}
          </Form.Item>
          <Form.Item label="矩阵样式">
            {getFieldDecorator('cellMatrixStyle', {
              initialValue: cellMatrixStyle,
            })(<CodeEditForm />)}
          </Form.Item>
        </Panel>
        <PaginationConfig {...props} style={{ ...props.style, showDataSourceLength: false }} />
      </Collapse>
    </div>
  );
}

Config.propTypes = {
  a: PropTypes.array,
};

export default Form.create({
  onFieldsChange: debounce((props, changedFields) => {
    const { form, style, updateStyle } = props;
    const newFields = form.getFieldsValue();
    updateStyle({ ...style, ...newFields });
  }),
})(Config);

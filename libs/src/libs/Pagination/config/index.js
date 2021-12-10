import React from 'react';
import PropTypes from 'prop-types';
import { Form, Switch, InputNumber, Input, Collapse } from 'antd';
import { debounce } from 'lodash';
import defaultConig from '../style';
const { Panel } = Collapse;

export function Config(props) {
  const {
    formItemLayout,
    form: { getFieldDecorator },
    style,
  } = props;
  const {
    pagination = defaultConig['pagination'],
    onePageShowPagination = defaultConig['onePageShowPagination'],
    defaultCurrentPage = defaultConig['defaultCurrentPage'],
    currentPageSvg = defaultConig['currentPageSvg'],
    defaultSvg = defaultConig['defaultSvg'],
    dataSouceLength = defaultConig['dataSouceLength'],
    pageSize = defaultConig['pageSize'],
    PaginationContainerStyle = defaultConig['PaginationContainerStyle'],
    svgContainer = defaultConig['svgContainer'],
    useAnimation = defaultConig['useAnimation'],
    hlightStyle = defaultConig['hlightStyle'],
    defaultStyle = defaultConig['defaultStyle'],
    showDataSourceLength = true,
    LastButtonStyle,
    NextButtonStyle,
    lastPageText = '<<  上一页',
    nextPageText = '下一页  >>',
  } = style;

  return (
    <div>
      <Collapse>
        <Panel header={'分页设置'}>
          <Form.Item label="启用分页" {...formItemLayout}>
            {getFieldDecorator('pagination', {
              initialValue: pagination,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>
          {pagination && (
            <>
              <Form.Item label="单页是否显示" {...formItemLayout}>
                {getFieldDecorator('onePageShowPagination', {
                  initialValue: onePageShowPagination,
                  valuePropName: 'checked',
                })(<Switch />)}
              </Form.Item>
            </>
          )}
          {pagination && (
            <>
              <Form.Item label="默认显示页" {...formItemLayout}>
                {getFieldDecorator('defaultCurrentPage', {
                  initialValue: defaultCurrentPage,
                })(<InputNumber />)}
              </Form.Item>
            </>
          )}
          {pagination && (
            <Form.Item label="默认svg" {...formItemLayout}>
              {getFieldDecorator('defaultSvg', {
                initialValue: defaultSvg,
              })(<Input.TextArea />)}
            </Form.Item>
          )}
          {pagination && (
            <Form.Item label="当前页svg" {...formItemLayout}>
              {getFieldDecorator('currentPageSvg', {
                initialValue: currentPageSvg,
              })(<Input.TextArea />)}
            </Form.Item>
          )}
          {pagination && showDataSourceLength && (
            <Form.Item label="数据个数" {...formItemLayout}>
              {getFieldDecorator('dataSouceLength', {
                initialValue: dataSouceLength,
              })(<InputNumber />)}
            </Form.Item>
          )}
          {pagination && (
            <Form.Item label="每页个数" {...formItemLayout}>
              {getFieldDecorator('pageSize', {
                initialValue: pageSize,
              })(<InputNumber />)}
            </Form.Item>
          )}
          {pagination && (
            <Form.Item label="容器样式" {...formItemLayout}>
              {getFieldDecorator('PaginationContainerStyle', {
                initialValue: PaginationContainerStyle,
              })(<Input.TextArea />)}
            </Form.Item>
          )}
          {pagination && (
            <Form.Item label="图标容器样式" {...formItemLayout}>
              {getFieldDecorator('svgContainer', {
                initialValue: svgContainer,
              })(<Input.TextArea />)}
            </Form.Item>
          )}
          {pagination && (
            <Form.Item label="启用动画" {...formItemLayout}>
              {getFieldDecorator('useAnimation', {
                initialValue: useAnimation,
                valuePropName: 'checked',
              })(<Switch />)}
            </Form.Item>
          )}
          {pagination && (
            <Form.Item label="当前页样式" {...formItemLayout}>
              {getFieldDecorator('hlightStyle', {
                initialValue: hlightStyle,
              })(<Input.TextArea />)}
            </Form.Item>
          )}
          {pagination && (
            <Form.Item label="默认样式" {...formItemLayout}>
              {getFieldDecorator('defaultStyle', {
                initialValue: defaultStyle,
              })(<Input.TextArea />)}
            </Form.Item>
          )}

          {pagination && (
            <Form.Item label="上一页样式" {...formItemLayout}>
              {getFieldDecorator('LastButtonStyle', {
                initialValue: LastButtonStyle,
              })(<Input.TextArea />)}
            </Form.Item>
          )}
          {pagination && (
            <Form.Item label="上一页文本" {...formItemLayout}>
              {getFieldDecorator('lastPageText', {
                initialValue: lastPageText,
              })(<Input.TextArea />)}
            </Form.Item>
          )}
          {pagination && (
            <Form.Item label="下一页样式" {...formItemLayout}>
              {getFieldDecorator('NextButtonStyle', {
                initialValue: NextButtonStyle,
              })(<Input.TextArea />)}
            </Form.Item>
          )}
          {pagination && (
            <Form.Item label="下一页文本" {...formItemLayout}>
              {getFieldDecorator('nextPageText', {
                initialValue: nextPageText,
              })(<Input.TextArea />)}
            </Form.Item>
          )}
        </Panel>
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

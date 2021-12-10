import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { useStyle } from '../option';
import { getValueFromEventForInputNumber } from '../../../../helpers/utils';
import { Form, InputNumber, Select, Switch, Collapse, Input } from 'antd';
import InputColor from '../../../../components/InputColor';
// import FilterFormItem from '../../../../components/FilterFormItem';

import styles from './index.less';

const AntdTableConfig = props => {
  const { formItemLayout, form, id, style } = props;
  const { getFieldDecorator, resetFields } = form;
  const {
    tableLayout,
    size,
    autoWrap,
    bordered,
    borderColor,
    // bgColor,
    header,
    column,
    pagination,
    row,
  } = useStyle(style);

  useEffect(() => {
    resetFields();
  }, [resetFields, id]);

  return (
    <div className={styles.container}>
      <Collapse bordered>
        <Collapse.Panel header="基础配置">
          <Form.Item label="表格布局" {...formItemLayout}>
            {getFieldDecorator('tableLayout', {
              initialValue: tableLayout,
            })(
              <Select placeholder="table-layout" allowClear>
                <Select.Option value="auto">auto</Select.Option>
                <Select.Option value="fixed">fixed</Select.Option>
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="表格大小" {...formItemLayout}>
            {getFieldDecorator('size', {
              initialValue: size,
            })(
              <Select placeholder="size">
                <Select.Option value="default">默认</Select.Option>
                <Select.Option value="middle">中</Select.Option>
                <Select.Option value="small">小</Select.Option>
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="文字自动换行" {...formItemLayout}>
            {getFieldDecorator('autoWrap', {
              initialValue: autoWrap,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          <Form.Item label="展示外边框和列边框" {...formItemLayout}>
            {getFieldDecorator('bordered', {
              initialValue: bordered,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          <Form.Item label="边框颜色" {...formItemLayout}>
            {getFieldDecorator('borderColor', {
              initialValue: borderColor,
            })(<InputColor />)}
          </Form.Item>

          {/* <Form.Item label="表格内容背景色" {...formItemLayout}>
            {getFieldDecorator('bgColor', {
              initialValue: bgColor,
            })(<InputColor />)}
          </Form.Item> */}
        </Collapse.Panel>

        <Collapse.Panel header="表头设置">
          <Form.Item label="显示表头" {...formItemLayout}>
            {getFieldDecorator('header.showHeader', {
              initialValue: header.showHeader,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          <Form.Item label="字体大小" {...formItemLayout}>
            {getFieldDecorator('header.fontSize', {
              initialValue: header.fontSize,
              getValueFromEvent: getValueFromEventForInputNumber,
            })(<InputNumber placeholder="fontSize" min={12} step={1} />)}
          </Form.Item>

          <Form.Item label="字体颜色" {...formItemLayout}>
            {getFieldDecorator('header.color', {
              initialValue: header.color,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="背景色" {...formItemLayout}>
            {getFieldDecorator('header.bgColor', {
              initialValue: header.bgColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="固定表头" {...formItemLayout}>
            {getFieldDecorator('header.isFixed', {
              initialValue: header.isFixed,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          <Form.Item label="ScrollY" {...formItemLayout}>
            {getFieldDecorator('header.scrollY', {
              initialValue: header.scrollY,
            })(<InputNumber min={0} step={1} />)}
          </Form.Item>
        </Collapse.Panel>

        <Collapse.Panel header="列配置">
          <Form.Item label="对齐方式" {...formItemLayout}>
            {getFieldDecorator('column.align', {
              initialValue: column.align,
            })(
              <Select placeholder="align">
                <Select.Option value="left">左对齐</Select.Option>
                <Select.Option value="right">右对齐</Select.Option>
                <Select.Option value="center">居中</Select.Option>
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="字体大小" {...formItemLayout}>
            {getFieldDecorator('column.fontSize', {
              initialValue: column.fontSize,
              getValueFromEvent: getValueFromEventForInputNumber,
            })(<InputNumber placeholder="fontSize" min={12} step={1} />)}
          </Form.Item>

          <Form.Item label="字体颜色" {...formItemLayout}>
            {getFieldDecorator('column.color', {
              initialValue: column.color,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="可点击字体颜色" {...formItemLayout}>
            {getFieldDecorator('column.clickColor', {
              initialValue: column.clickColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="超长省略(表格布局为fixed)" {...formItemLayout}>
            {getFieldDecorator('column.ellipsis', {
              initialValue: column.ellipsis,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          <Form.Item label="空值显示字符" {...formItemLayout}>
            {getFieldDecorator('column.emptyText', {
              initialValue: column.emptyText,
            })(<Input placeholder="emptyText" />)}
          </Form.Item>

          <Form.Item label="空值定义" {...formItemLayout}>
            {getFieldDecorator('column.emptyList', {
              initialValue: column.emptyList,
            })(
              <Select placeholder="emptyList" mode="multiple" allowClear>
                <Select.Option value="undefined">undefined</Select.Option>
                <Select.Option value="">空字符串</Select.Option>
                <Select.Option value="null">null</Select.Option>
              </Select>,
            )}
          </Form.Item>

          {/* <Form.Item label="自定义列" {...formItemLayout}>
            {getFieldDecorator('column.useRenderFunc', {
              initialValue: column.useRenderFunc,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          <FilterFormItem
            fieldLabel="自定义列render函数"
            initialValue={column.renderFunc}
            formFieldName="column.renderFunc"
            formItemLayout={formItemLayout}
            form={form}
          /> */}
        </Collapse.Panel>

        <Collapse.Panel header="行配置">
          <Form.Item label="单行背景色" {...formItemLayout}>
            {getFieldDecorator('row.oddBgColor', {
              initialValue: row.oddBgColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="双行背景色" {...formItemLayout}>
            {getFieldDecorator('row.evenBgColor', {
              initialValue: row.evenBgColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="行Padding" {...formItemLayout}>
            {getFieldDecorator('row.rowPadding', {
              initialValue: row.rowPadding,
            })(<Input placeholder="16px 16px" />)}
          </Form.Item>

          {/* 高亮行设置 */}
          <Form.Item label="开启行高亮" {...formItemLayout}>
            {getFieldDecorator('row.isHighlight', {
              initialValue: row.isHighlight,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          <Form.Item label="高亮字段" {...formItemLayout}>
            {getFieldDecorator('row.highlightKey', {
              initialValue: row.highlightKey,
            })(<Input />)}
          </Form.Item>

          <Form.Item label="高亮颜色" {...formItemLayout}>
            {getFieldDecorator('row.highlightColor', {
              initialValue: row.highlightColor,
            })(<InputColor />)}
          </Form.Item>

          <Form.Item label="单元格点击高亮" {...formItemLayout}>
            {getFieldDecorator('row.showCellHighlight', {
              valuePropName: 'checked',
              initialValue: row.showCellHighlight,
            })(<Switch />)}
          </Form.Item>
          <Form.Item label="单元格高亮颜色" {...formItemLayout}>
            {getFieldDecorator('row.cellHighlightBgcolor', {
              initialValue: row.cellHighlightBgcolor,
            })(<InputColor />)}
          </Form.Item>
          <Form.Item label="单元格高亮字体颜色" {...formItemLayout}>
            {getFieldDecorator('row.cellHighlightFontcolor', {
              initialValue: row.cellHighlightFontcolor,
            })(<InputColor />)}
          </Form.Item>
        </Collapse.Panel>

        <Collapse.Panel header="分页器配置">
          <Form.Item label="显示分页器" {...formItemLayout}>
            {getFieldDecorator('pagination.show', {
              initialValue: pagination.show,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          <Form.Item label="位置" {...formItemLayout}>
            {getFieldDecorator('pagination.position', {
              initialValue: pagination.position,
            })(
              <Select placeholder="position">
                <Select.Option value="bottom">底部</Select.Option>
                <Select.Option value="top">顶部</Select.Option>
                <Select.Option value="both">顶部和底部都展示</Select.Option>
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="分页大小" {...formItemLayout}>
            {getFieldDecorator('pagination.size', {
              initialValue: pagination.size,
            })(
              <Select placeholder="size">
                <Select.Option value="default">默认</Select.Option>
                <Select.Option value="middle">中</Select.Option>
                <Select.Option value="small">小</Select.Option>
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="只有一页时隐藏分页器" {...formItemLayout}>
            {getFieldDecorator('pagination.hideOnSinglePage', {
              initialValue: pagination.hideOnSinglePage,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          <Form.Item label="show less page items" {...formItemLayout}>
            {getFieldDecorator('pagination.showLessItems', {
              initialValue: pagination.showLessItems,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          <Form.Item label="快速跳转至某页" {...formItemLayout}>
            {getFieldDecorator('pagination.showQuickJumper', {
              initialValue: pagination.showQuickJumper,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          <Form.Item label="可以改变 pageSize" {...formItemLayout}>
            {getFieldDecorator('pagination.showSizeChanger', {
              initialValue: pagination.showSizeChanger,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          <Form.Item label="显示为简单分页" {...formItemLayout}>
            {getFieldDecorator('pagination.simple', {
              initialValue: pagination.simple,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>
        </Collapse.Panel>

        {/* 固定列配置 */}
        <Collapse.Panel header="固定列配置">
          <Form.Item label="开启列固定" {...formItemLayout}>
            {getFieldDecorator('column.isFixed', {
              initialValue: column.isFixed,
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          <Form.Item label="左侧固定列数" {...formItemLayout}>
            {getFieldDecorator('column.leftFixed', {
              initialValue: column.leftFixed,
            })(<InputNumber min={0} step={1} />)}
          </Form.Item>

          <Form.Item label="右侧固定列数" {...formItemLayout}>
            {getFieldDecorator('column.rightFixed', {
              initialValue: column.rightFixed,
            })(<InputNumber min={0} step={1} />)}
          </Form.Item>

          <Form.Item label="固定列宽度" {...formItemLayout}>
            {getFieldDecorator('column.fixedWidth', {
              initialValue: column.fixedWidth,
            })(<InputNumber min={0} step={1} />)}
          </Form.Item>

          <Form.Item label="ScrollX" {...formItemLayout}>
            {getFieldDecorator('column.scrollX', {
              initialValue: column.scrollX,
            })(<InputNumber min={0} step={1} />)}
          </Form.Item>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

AntdTableConfig.propTypes = {
  updateStyle: PropTypes.func,
  formItemLayout: PropTypes.object,
  form: PropTypes.object,
  data: PropTypes.object,
  style: PropTypes.object,
  id: PropTypes.string,
};

export default Form.create({
  onFieldsChange: debounce((props, changedFields, allFields) => {
    const {
      form: { getFieldsValue },
      style,
      updateStyle,
    } = props;

    const newFileds = getFieldsValue();
    const newStyle = { ...style, ...newFileds };
    updateStyle(newStyle);
  }, 500),
})(AntdTableConfig);

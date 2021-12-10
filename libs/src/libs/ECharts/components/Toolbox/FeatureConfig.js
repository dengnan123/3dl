import React from 'react';
import PropTypes from 'prop-types';
import { Form, Switch, Input, Select, InputNumber } from 'antd';
import InputColor from '../../../../components/InputColor';

const FormItem = Form.Item;

const featureDefaultValue = {
  saveAsImage: { title: '保存为图片' },
  restore: { title: '配置项还原' },
  dataView: { title: '数据视图' },
  // dataZoom: { title: '区域缩放' },
  magicType: { title: '动态类型切换' },
};

const FeatureConfig = props => {
  const { data, form, formItemLayout } = props;
  const { getFieldDecorator } = form;

  return (
    <>
      {/* 区域缩放工具配置开始 */}
      {/* <h4 style={{ color: '#1991eb' }}>区域缩放工具,目前只支持直角坐标系的缩放</h4>
      <FormItem label="显示图标" {...formItemLayout}>
        {getFieldDecorator(`feature.dataZoom.show`, {
          initialValue: data?.feature?.dataZoom?.show ?? false,
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="区域缩放标题" {...formItemLayout}>
        {getFieldDecorator(`feature.dataZoom.title.zoom`, {
          initialValue: data?.feature?.dataZoom?.title?.zoom ?? '区域缩放',
        })(<Input placeholder="区域缩放标题" />)}
      </FormItem>

      <FormItem label="区域缩放还原标题" {...formItemLayout}>
        {getFieldDecorator(`feature.dataZoom.title.back`, {
          initialValue: data?.feature?.dataZoom?.title?.back ?? '区域缩放还原',
        })(<Input placeholder="区域缩放还原标题" />)}
      </FormItem>
       */}
      {/* 区域缩放工具配置结束 */}

      {/* 数据视图工具配置开始 */}
      <h4 style={{ color: '#1991eb' }}>数据视图工具</h4>
      <Basic form={form} formItemLayout={formItemLayout} type="dataView" data={data?.feature} />

      <FormItem label="是否不可编辑（只读）" {...formItemLayout}>
        {getFieldDecorator(`feature.dataView.readOnly`, {
          initialValue: data?.feature?.dataView?.readOnly ?? false,
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>
      {/* 数据视图工具配置结束 */}

      {/* 动态类型切换工具配置开始 */}
      <h4 style={{ color: '#1991eb' }}>动态类型切换工具</h4>

      <FormItem label="显示图标" {...formItemLayout}>
        {getFieldDecorator(`feature.magicType.show`, {
          initialValue: data?.feature?.magicType?.show ?? false,
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="可切换的动态类型" {...formItemLayout}>
        {getFieldDecorator(`feature.magicType.type`, {
          initialValue: data?.feature?.magicType?.type ?? ['line', 'bar'],
        })(
          <Select placeholder="动态类型" mode="multiple">
            <Select.Option value="line">切换为折线图</Select.Option>
            <Select.Option value="bar">切换为柱状图</Select.Option>
            <Select.Option value="stack">切换为堆叠模式</Select.Option>
          </Select>,
        )}
      </FormItem>

      <FormItem label="动态类型折线图标题" {...formItemLayout}>
        {getFieldDecorator(`feature.magicType.title.line`, {
          initialValue: data?.feature?.magicType?.title?.line ?? '切换为折线图',
        })(<Input placeholder="动态类型折线图标题" />)}
      </FormItem>

      <FormItem label="动态类型柱状图标题" {...formItemLayout}>
        {getFieldDecorator(`feature.magicType.title.bar`, {
          initialValue: data?.feature?.magicType?.title?.bar ?? '切换为柱状图',
        })(<Input placeholder="动态类型折线图标题" />)}
      </FormItem>

      <FormItem label="动态类型堆叠模式标题" {...formItemLayout}>
        {getFieldDecorator(`feature.magicType.title.stack`, {
          initialValue: data?.feature?.magicType?.title?.stack ?? '切换为堆叠模式',
        })(<Input placeholder="动态类型堆叠标题" />)}
      </FormItem>
      {/* 动态类型切换工具配置结束 */}

      {/* 配置项还原工具配置开始 */}
      <h4 style={{ color: '#1991eb' }}>配置项还原工具</h4>
      <Basic form={form} formItemLayout={formItemLayout} type="restore" data={data?.feature} />
      {/* 配置项还原工具配置结束 */}

      {/* 保存为图片工具配置开始 */}
      <h4 style={{ color: '#1991eb' }}>保存为图片工具</h4>
      <Basic form={form} formItemLayout={formItemLayout} type="saveAsImage" data={data?.feature} />

      <FormItem label="保存的图片格式" {...formItemLayout}>
        {getFieldDecorator(`feature.saveAsImage.type`, {
          initialValue: data?.feature?.saveAsImage?.type ?? 'png',
        })(
          <Select placeholder="图片格式">
            <Select.Option value="png">png</Select.Option>
            <Select.Option value="jpeg">jpeg</Select.Option>
          </Select>,
        )}
      </FormItem>

      <FormItem label="保存的图片名称" {...formItemLayout}>
        {getFieldDecorator(`feature.saveAsImage.name`, {
          initialValue: data?.feature?.saveAsImage?.name,
        })(<Input placeholder="图片名称" />)}
      </FormItem>

      <FormItem label="保存图片的分辨率比例，默认跟容器相同大小" {...formItemLayout}>
        {getFieldDecorator(`feature.saveAsImage.pixelRatio`, {
          initialValue: data?.feature?.saveAsImage?.pixelRatio ?? 1,
        })(<InputNumber min={0} />)}
      </FormItem>

      <FormItem label="保存的图片背景色" {...formItemLayout}>
        {getFieldDecorator(`feature.saveAsImage.backgroundColor`, {
          initialValue: data?.feature?.saveAsImage?.backgroundColor,
        })(<InputColor />)}
      </FormItem>

      <FormItem label="保存为图片时忽略的组件列表，默认忽略工具栏" {...formItemLayout}>
        {getFieldDecorator(`feature.saveAsImage.excludeComponents`, {
          initialValue: data?.feature?.saveAsImage?.excludeComponents ?? ['toolbox'],
        })(
          <Select placeholder="忽略的组件列表" mode="multiple">
            <Select.Option value="toolbox">工具栏</Select.Option>
          </Select>,
        )}
      </FormItem>
      {/* 保存为图片工具配置结束 */}
    </>
  );
};

FeatureConfig.propTypes = {
  data: PropTypes.object,
  form: PropTypes.shape({ getFieldDecorator: PropTypes.func }),
  formItemLayout: PropTypes.object,
};

export default FeatureConfig;

function Basic(props) {
  const { data, form, formItemLayout, type } = props;
  const { getFieldDecorator } = form;

  return (
    <>
      <FormItem label="显示图标" {...formItemLayout}>
        {getFieldDecorator(`feature[${type}].show`, {
          initialValue: data?.[type]?.show ?? false,
          valuePropName: 'checked',
        })(<Switch />)}
      </FormItem>

      <FormItem label="图标标题" {...formItemLayout}>
        {getFieldDecorator(`feature[${type}].title`, {
          initialValue: data?.[type]?.title ?? featureDefaultValue[type]?.title,
        })(<Input placeholder="title" />)}
      </FormItem>
    </>
  );
}

Basic.propTypes = {
  form: PropTypes.shape({ getFieldDecorator: PropTypes.func }),
  formItemLayout: PropTypes.object,
  data: PropTypes.object,
  type: PropTypes.string,
};

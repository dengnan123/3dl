import React, { useEffect, useState } from 'react';
import { Form, Switch, Collapse, Select, Modal, Button, InputNumber } from 'antd';
import { debounce } from 'lodash';
import AnotherEditor from '../../../../components/CodeEdit';
const FormItem = Form.Item;
const { Panel } = Collapse;

const PPSConfigPlaceHolder = React.forwardRef(({ onChange, value, ...props }, ref) => {
  useEffect(() => {
    onChange && onChange(value);
  }, [onChange, value]);
  return <div ref={ref}></div>;
});

function ThreejsConfig(props) {
  const {
    form: { getFieldDecorator, resetFields, setFieldsValue },
    style,
    id,
  } = props;

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id]);

  const [visible, setVisible] = useState(false);
  const onCancelModal = () => {
    setVisible(false);
  };

  const update = obj => {
    setFieldsValue({ PPScongfigs: { ...obj } });
    onCancelModal();
  };

  const {
    closeGUIManager = false,
    isHideGUI = false,
    isHideStats = false,
    lerpData = 0,
    PPScongfigs = {},
  } = style;

  const editProps = { update, disCode: false, language: 'json', code: PPScongfigs };

  return (
    <div>
      <Collapse defaultActiveKey={['控制器']}>
        <Panel header="控制器" key="控制器">
          <FormItem label="关闭控制器">
            {getFieldDecorator('closeGUIManager', {
              valuePropName: 'checked',
              initialValue: closeGUIManager,
            })(<Switch />)}
          </FormItem>
          <FormItem label="隐藏控制器">
            {getFieldDecorator('isHideGUI', {
              valuePropName: 'checked',
              initialValue: isHideGUI,
            })(<Switch disabled={closeGUIManager} />)}
          </FormItem>
          <FormItem label="隐藏性能数据">
            {getFieldDecorator('isHideStats', {
              valuePropName: 'checked',
              initialValue: isHideStats,
            })(<Switch disabled={closeGUIManager} />)}
          </FormItem>
        </Panel>
      </Collapse>

      <FormItem label="默认图">
        {getFieldDecorator('defaultPPS', {
          initialValue: style?.defaultPPS || 'multiplePointNoisePPS',
        })(
          <Select>
            <Select.Option key="hisRangePPS">黄白甲醛</Select.Option>
            <Select.Option key="waterDropWavePPS">水滴波纹</Select.Option>
            <Select.Option key="multiplePointNoisePPS">噪声</Select.Option>
            <Select.Option key="multiplyPointsFloorFadePPS">渐变</Select.Option>
            <Select.Option key="multiplyLevelFlowPPS">流动</Select.Option>
            <Select.Option key="waterSimulationPPS">水质水模拟</Select.Option>
            {/* <Select.Option key="building20Floors">大楼20层</Select.Option> */}
            <Select.Option key="waterWaveSimulation">噪声水波模拟</Select.Option>
            <Select.Option key="volumeCloudPPS">CO2体积云</Select.Option>
            <Select.Option key="hisRangePPS2">TVOC</Select.Option>
          </Select>,
        )}
      </FormItem>

      <FormItem label="初始实例化">
        {getFieldDecorator('initPPSs', {
          initialValue: style?.initPPSs || [
            'hisRangePPS',
            'waterDropWavePPS',
            'multiplePointNoisePPS',
            'multiplyPointsFloorFadePPS',
            'multiplyLevelFlowPPS',
            'waterSimulationPPS',
            // 'building20Floors',
            'waterWaveSimulation',
            'volumeCloudPPS',
            'hisRangePPS2',
          ],
        })(
          <Select mode="multiple" style={{ width: '100%' }} placeholder="Please select">
            <Select.Option key="hisRangePPS">黄白甲醛</Select.Option>
            <Select.Option key="waterDropWavePPS">水滴波纹</Select.Option>
            <Select.Option key="multiplePointNoisePPS">噪声</Select.Option>
            <Select.Option key="multiplyPointsFloorFadePPS">渐变</Select.Option>
            <Select.Option key="multiplyLevelFlowPPS">流动</Select.Option>
            <Select.Option key="waterSimulationPPS">水质水模拟</Select.Option>
            {/* <Select.Option key="building20Floors">大楼20层</Select.Option> */}
            <Select.Option key="waterWaveSimulation">噪声水波模拟</Select.Option>
            <Select.Option key="volumeCloudPPS">CO2体积云</Select.Option>
            <Select.Option key="hisRangePPS2">TVOC</Select.Option>
          </Select>,
        )}
      </FormItem>

      <FormItem>
        {getFieldDecorator('PPScongfigs', {
          initialValue: PPScongfigs,
        })(<PPSConfigPlaceHolder />)}
      </FormItem>

      <FormItem label="渐变时间">
        {getFieldDecorator('lerpData', {
          initialValue: lerpData,
        })(<InputNumber step={0.001} min={0} />)}
      </FormItem>

      <Button
        onClick={() => {
          setVisible(true);
        }}
      >
        保存配置
      </Button>
      <Modal
        title={'配置拓展'}
        width={1000}
        visible={visible}
        footer={null}
        onCancel={onCancelModal}
      >
        {visible && <AnotherEditor {...editProps} />}
      </Modal>
    </div>
    /* <Collapse defaultActiveKey={['基础配置']}>
        <Panel header="基础配置" key="基础配置">
          <FormItem label="阶数">
            {getFieldDecorator('step', {
              initialValue: style?.step || 12,
            })(<Slider step={0.1} min={0} max={40} />)}
          </FormItem>
          <FormItem label="指数">
            {getFieldDecorator('exp', {
              initialValue: style?.exp || 0.8,
            })(<Slider step={0.1} min={0} max={4} />)}
          </FormItem>
          <FormItem label="速度">
            {getFieldDecorator('stepSpeed', {
              initialValue: style?.stepSpeed || 0.8,
            })(<Slider onChange={handleStepSpeedChange} step={0.1} min={0} max={5} />)}
          </FormItem>
          <FormItem label="偏移">
            {getFieldDecorator('hisOffset', {
              initialValue: style?.hisOffset || 0.8,
            })(<Slider step={0.01} min={0} max={1} />)}
          </FormItem>
          <FormItem label="长度">
            {getFieldDecorator('hisLength', {
              initialValue: style?.hisLength || 0.8,
            })(<Slider step={0.01} min={0} max={1} />)}
          </FormItem>
        </Panel>
      </Collapse> */
  );
}

export default Form.create({
  onFieldsChange: debounce((props, changedFields) => {
    const {
      form: { getFieldsValue },
      style,
      updateStyle,
    } = props;
    const newFields = getFieldsValue();
    // console.log('newFields: ', newFields);

    updateStyle({
      ...style,
      ...newFields,
    });
  }, 500),
})(ThreejsConfig);

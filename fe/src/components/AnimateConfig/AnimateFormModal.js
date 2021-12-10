import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import anime from 'animejs/lib/anime.es.js';
import { doAnimation, getAnimateClassNames, getAnimateStyles } from '@/helpers/animation/util';
import { InAnimationList, OutAnimationList, DirectionList } from '@/helpers/animation/const';
import { Form, Select, Button, Modal, InputNumber, Switch } from 'antd';
import ModalCodeEdit from '@/components/ModalCodeEdit';

import styles from './index.less';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const AnimationListByType = {
  inAnimation: InAnimationList,
  outAnimation: OutAnimationList,
};

function AnimateFormModal(props) {
  const { onOk, onCancel, title, visible, form, data = {}, animationType = 'inAnimation' } = props;

  const { getFieldDecorator, validateFields, getFieldValue, getFieldsValue, resetFields } = form;

  const [{ animateClassNames, animateStyles }, setState] = useState({
    animateClassNames: '',
    animateStyles: null,
  });

  const animateBoxRef = useRef(null);
  const animeRef = useRef([]);

  const updateState = useCallback(payload => setState(state => ({ ...state, ...payload })), []);

  const afterClose = useCallback(() => {
    animeRef.current = null;
    updateState({ keys: [0] });
    resetFields();
  }, [updateState, resetFields]);

  const handleOk = useCallback(() => {
    validateFields((errors, values) => {
      if (errors) return;
      onOk && onOk(values);
    });
  }, [onOk, validateFields]);

  const handleCancel = useCallback(() => {
    onCancel && onCancel();
  }, [onCancel]);

  const handleAnimate = useCallback(() => {
    const fieldsValue = getFieldsValue() || {};

    const animateClassNames = getAnimateClassNames(fieldsValue);
    const animateStyles = getAnimateStyles(fieldsValue);

    updateState({ animateClassNames, animateStyles });

    doAnimation(animateBoxRef.current, fieldsValue);
  }, [updateState]);

  const loop = getFieldValue('loop') ?? false;
  const custom = getFieldValue('custom') ?? false;

  const animationConfigProps = {
    form,
    formItemLayout,
    field: 'animationConfigFilterFunc',
    data,
    formLabel: '动画配置',
    btnText: '点击设置',
    btnSize: 'small',
    disabled: !custom,
    titleFiledArr: [],
  };

  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      afterClose={afterClose}
      width={850}
      destroyOnClose={true}
      maskClosable={false}
      className={styles.modal}
    >
      <div className={styles.left}>
        <Button className={styles.animateBtn} type="primary" onClick={handleAnimate}>
          执行动画
        </Button>
        <h1
          className={animateClassNames}
          ref={animateBoxRef}
          style={{
            color: '#1991eb',
            fontSize: '50px',
            ...animateStyles,
          }}
        >
          Animate.css
        </h1>
      </div>
      <div className={styles.right}>
        <FormItem label="动画效果" {...formItemLayout}>
          {getFieldDecorator('name', { initialValue: data?.name })(
            <Select placeholder="请选择动画效果" allowClear>
              {AnimationListByType[animationType]?.map(n => {
                return (
                  <Select.Option key={n.key} value={n.key}>
                    {n.label}--{n.value}
                  </Select.Option>
                );
              })}
            </Select>,
          )}
        </FormItem>

        <FormItem label="速度(秒)" {...formItemLayout}>
          {getFieldDecorator('duration', {
            initialValue: data?.duration,
          })(<InputNumber min={0} placeholder="请填写动画速度" allowClear />)}
        </FormItem>

        <FormItem label="延迟(秒)" {...formItemLayout}>
          {getFieldDecorator('delay', {
            initialValue: data?.delay,
          })(<InputNumber min={0} placeholder="请填写动画延迟" allowClear />)}
        </FormItem>

        <FormItem label="方向" {...formItemLayout}>
          {getFieldDecorator('direction', {
            initialValue: data?.direction,
          })(
            <Select placeholder="请选择方向" allowClear>
              {DirectionList.map(n => {
                return (
                  <Select.Option key={n.value} value={n.value}>
                    {n.value}--{n.label}
                  </Select.Option>
                );
              })}
            </Select>,
          )}
        </FormItem>

        <FormItem label="无线循环" {...formItemLayout}>
          {getFieldDecorator('loop', { initialValue: data?.loop, valuePropName: 'checked' })(
            <Switch />,
          )}
        </FormItem>

        <FormItem label="执行次数" {...formItemLayout}>
          {getFieldDecorator('iterationCount', {
            initialValue: data?.iterationCount,
            rules: [{ type: 'integer', message: '请输入整数' }],
          })(<InputNumber disabled={loop} min={1} placeholder="请填写执行次数" allowClear />)}
        </FormItem>

        <FormItem label="自定义动画" {...formItemLayout}>
          {getFieldDecorator('custom', { initialValue: data?.custom, valuePropName: 'checked' })(
            <Switch />,
          )}
        </FormItem>

        <ModalCodeEdit {...animationConfigProps} />
      </div>
    </Modal>
  );
}

AnimateFormModal.propTypes = {
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  title: PropTypes.any,
  visible: PropTypes.bool,
  form: PropTypes.object,
  animateType: PropTypes.string,
};

export default Form.create()(AnimateFormModal);

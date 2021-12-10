import React, { useEffect, Fragment } from 'react';
import { Form, InputNumber, Select, Button, Tooltip, Icon, Row, Col, Checkbox } from 'antd';
import { debounce, omit } from 'lodash';
import { copyToClip } from '@/helpers/utils';
import InputColor from '@/components/InputColor';
// import HighConfig from '@/components/HighConfig';
import ModalCodeEdit from '@/components/ModalCodeEdit';
import AnimateConfig from '@/components/AnimateConfig';

import SlideModal from './SlideModal';
import XSlideModal from './XSlideModal';

import styles from './index.less';
const { Option } = Select;

const BasicConfig = props => {
  const {
    formItemLayout,
    form,
    form: { getFieldDecorator, resetFields },
    isSelectCompInfo,
  } = props;
  const {
    id,
    width,
    height,
    left,
    top,
    basicStyle = {},
    // child,
    compName,
    aliasName,
    zIndex,
  } = isSelectCompInfo;
  const {
    borderWidth,
    borderColor,
    paddingLeft,
    paddingRight,
    borderStyle,
    paddingTop,
    backgroundColor,
    forbidWidthScale,
    forbidPositionScale,
    inAnimation,
    sortIndex,
    showLoading,
    openHighConfig,
    closeSync,
    openPreload,
    openSlideUp,
    openSwipeDown,
    slideUpConfig,
    swipeDownConfig,
    openRightSlide,
    openLeftSlide,
    rightSlideConfig,
    leftSlideConfig,
  } = basicStyle;

  // let show = true;
  // if (child && child.length) {
  //   show = false;
  // }

  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id]);

  // const unset = key => {
  //   setFieldsValue({
  //     [key]: '',
  //   });
  // };

  // const hasBackgroundColor = getFieldValue('backgroundColor') || backgroundColor;

  // const hasBorderColor = getFieldValue('borderColor') || borderColor;

  // const hasBorderStyle = getFieldValue('borderStyle') || borderStyle;

  const highConfigProps = {
    form,
    formItemLayout,
    field: 'basicStyleFilterFunc',
    data: basicStyle,
    formLabel: '',
    btnSize: 'small',
    btnText: '设置',
  };

  const xSlideDisabled = openSlideUp || openSwipeDown;
  const ySlideDisabled = openRightSlide || openLeftSlide;

  return (
    <div style={{ padding: '0 20px' }}>
      <div className={styles.basicInfo}>
        <h3>
          <span onClick={() => copyToClip(compName)}>
            {compName}
            <em>(zIndex:{zIndex})</em>
          </span>
          <span>
            <Button
              size="small"
              type="primary"
              onClick={() => {
                copyToClip(id);
              }}
            >
              点击复制ID
            </Button>
          </span>
        </h3>

        {aliasName && (
          <p onClick={() => copyToClip(aliasName)} style={{ cursor: 'pointer' }}>
            {aliasName}
          </p>
        )}
      </div>

      <Row className={styles.itemRows}>
        <Col span={12}>
          <Form.Item label="width">
            {getFieldDecorator('width', {
              initialValue: width,
            })(<InputNumber min={0} />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="height">
            {getFieldDecorator('height', {
              initialValue: height,
            })(<InputNumber min={0} />)}
          </Form.Item>
        </Col>
      </Row>

      <Row className={styles.itemRows}>
        <Col span={12}>
          <Form.Item label="left">
            {getFieldDecorator('left', {
              initialValue: left,
            })(<InputNumber />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="top">
            {getFieldDecorator('top', {
              initialValue: top,
            })(<InputNumber />)}
          </Form.Item>
        </Col>
      </Row>

      {/* <Form.Item label="right(left优先)" {...formItemLayout}>
        {getFieldDecorator('right', {
          initialValue: right,
        })(<InputNumber />)}
      </Form.Item>
      <Form.Item label="bottom(top优先)" {...formItemLayout}>
        {getFieldDecorator('bottom', {
          initialValue: bottom,
        })(<InputNumber />)}
      </Form.Item> */}

      <Row className={styles.itemRows}>
        <Col span={12}>
          <Form.Item label="边框宽度" {...formItemLayout}>
            {getFieldDecorator('borderWidth', {
              initialValue: borderWidth,
            })(<InputNumber />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="边框类型" {...formItemLayout}>
            {getFieldDecorator('borderStyle', {
              initialValue: borderStyle,
            })(
              <Select style={{ width: '100%' }} allowClear>
                <Option value="solid">实线</Option>
                <Option value="dashed">虚线</Option>
                <Option value="dotted">点线</Option>
              </Select>,
            )}
          </Form.Item>
        </Col>
      </Row>

      <Row className={styles.itemRows}>
        <Col span={12}>
          <Form.Item label="边框颜色">
            {getFieldDecorator('borderColor', {
              initialValue: borderColor,
            })(<InputColor />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="背景色">
            {getFieldDecorator('backgroundColor', {
              initialValue: backgroundColor,
            })(<InputColor />)}
          </Form.Item>
        </Col>
      </Row>

      <Row className={styles.itemRows}>
        <Col span={12}>
          <Form.Item label="左内边距">
            {getFieldDecorator('paddingLeft', {
              initialValue: paddingLeft,
            })(<InputNumber />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="右内边距">
            {getFieldDecorator('paddingRight', {
              initialValue: paddingRight,
            })(<InputNumber />)}
          </Form.Item>
        </Col>
      </Row>

      <Row className={styles.itemRows}>
        <Col span={12}>
          <Form.Item label="上内边距">
            {getFieldDecorator('paddingTop', {
              initialValue: paddingTop,
            })(<InputNumber />)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="sortIndex">
            {getFieldDecorator('sortIndex', {
              initialValue: sortIndex,
            })(<InputNumber />)}
          </Form.Item>
        </Col>
      </Row>

      <Row className={styles.itemRows}>
        <Col span={12}>
          <Form.Item label="">
            {getFieldDecorator('forbidWidthScale', {
              initialValue: forbidWidthScale,
              valuePropName: 'checked',
            })(<Checkbox>宽度禁止缩放</Checkbox>)}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="">
            {getFieldDecorator('forbidPositionScale', {
              initialValue: forbidPositionScale,
              valuePropName: 'checked',
            })(<Checkbox>位置禁止缩放</Checkbox>)}
          </Form.Item>
        </Col>
      </Row>

      <Row className={styles.itemRows}>
        <Col span={12}>
          <Form.Item label="">
            {getFieldDecorator('closeSync', {
              initialValue: closeSync,
              valuePropName: 'checked',
            })(
              <Checkbox>
                关闭同步&nbsp;
                <Tooltip title="关闭后，组件不会把left,top,width,height信息同步到子组件，请谨慎使用！！">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </Checkbox>,
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="">
            {getFieldDecorator('openPreload', {
              initialValue: openPreload,
              valuePropName: 'checked',
            })(
              <Checkbox>
                资源预加载&nbsp;
                <Tooltip title="只有媒体资源才会生效">
                  <Icon type="question-circle-o" />
                </Tooltip>
              </Checkbox>,
            )}
          </Form.Item>
        </Col>
      </Row>

      <Row className={styles.itemRows}>
        <Col span={12}>
          <Form.Item label="">
            {getFieldDecorator('showLoading', {
              initialValue: showLoading,
              valuePropName: 'checked',
            })(<Checkbox>展示 Loading</Checkbox>)}
          </Form.Item>
        </Col>
      </Row>

      <Row className={styles.itemRows}>
        <Col span={12}>
          <Form.Item label="">
            {getFieldDecorator('openHighConfig', {
              initialValue: openHighConfig,
              valuePropName: 'checked',
            })(<Checkbox>开启高级</Checkbox>)}
          </Form.Item>
        </Col>
        <Col span={12} className={styles.formItemStyle}>
          {openHighConfig ? <ModalCodeEdit {...highConfigProps}></ModalCodeEdit> : null}
        </Col>
      </Row>

      <Row className={styles.itemRows}>
        <Col span={12}>
          <Form.Item label="">
            {getFieldDecorator('openSlideUp', {
              initialValue: openSlideUp,
              valuePropName: 'checked',
            })(<Checkbox disabled={ySlideDisabled}>开启上滑</Checkbox>)}
          </Form.Item>
        </Col>
        <Col span={12} className={styles.formItemStyle}>
          {openSlideUp ? (
            <SlideModal form={form} data={slideUpConfig} label={'slideUpConfig'} isUp={true} />
          ) : null}
        </Col>
      </Row>

      <Row className={styles.itemRows}>
        <Col span={12}>
          <Form.Item label="">
            {getFieldDecorator('openSwipeDown', {
              initialValue: openSwipeDown,
              valuePropName: 'checked',
            })(<Checkbox disabled={ySlideDisabled}>开启下滑</Checkbox>)}
          </Form.Item>
        </Col>
        <Col span={12} className={styles.formItemStyle}>
          {openSwipeDown ? (
            <SlideModal form={form} data={swipeDownConfig} label={'swipeDownConfig'} />
          ) : null}
        </Col>
      </Row>

      <Row className={styles.itemRows}>
        <Col span={12}>
          <Form.Item label="">
            {getFieldDecorator('openRightSlide', {
              initialValue: openRightSlide,
              valuePropName: 'checked',
            })(<Checkbox disabled={xSlideDisabled}>开启右滑</Checkbox>)}
          </Form.Item>
        </Col>
        <Col span={12} className={styles.formItemStyle}>
          {openRightSlide ? (
            <XSlideModal
              form={form}
              data={rightSlideConfig}
              label={'rightSlideConfig'}
              isRight={true}
            />
          ) : null}
        </Col>
      </Row>

      <Row className={styles.itemRows}>
        <Col span={12}>
          <Form.Item label="">
            {getFieldDecorator('openLeftSlide', {
              initialValue: openLeftSlide,
              valuePropName: 'checked',
            })(<Checkbox disabled={xSlideDisabled}>开启左滑</Checkbox>)}
          </Form.Item>
        </Col>
        <Col span={12} className={styles.formItemStyle}>
          {openLeftSlide ? (
            <XSlideModal form={form} data={leftSlideConfig} label={'leftSlideConfig'} />
          ) : null}
        </Col>
      </Row>

      <Row className={styles.itemRows}>
        <Col span={24}>
          <Form.Item label="" className={styles.formItemStyle}>
            {getFieldDecorator('inAnimation', {
              initialValue: inAnimation,
            })(
              <AnimateConfig
                animationType="inAnimation"
                btnSize="small"
                btnText="设置进场动画"
                formLabel="进场动画"
              />,
            )}
          </Form.Item>
        </Col>
      </Row>

      <Fragment>
        {/* {hasBackgroundColor && (
          <Button
            onClick={() => {
              unset('backgroundColor');
            }}
          >
            取消背景色
          </Button>
        )}

        {hasBorderStyle && (
          <Button
            onClick={() => {
              unset('borderStyle');
            }}
          >
            取消边框
          </Button>
        )}

        {hasBorderColor && (
          <Button
            onClick={() => {
              unset('borderColor');
            }}
          >
            取消边框色
          </Button>
        )} */}

        {/* <Form.Item label="圆角" {...formItemLayout}>
            {getFieldDecorator('borderRaduis', {
              initialValue: borderRaduis,
            })(<InputNumber />)}
          </Form.Item> */}

        {/* <Form.Item label="是否禁止缩放" {...formItemLayout}>
          {getFieldDecorator('forbidScale', {
            initialValue: forbidScale,
            valuePropName: 'checked',
          })(<Switch />)}
        </Form.Item> */}

        {/* <Form.Item label="高度禁止缩放" {...formItemLayout}>
          {getFieldDecorator('forbidHeightScale', {
            initialValue: forbidHeightScale,
            valuePropName: 'checked',
          })(<Switch />)}
        </Form.Item> */}
      </Fragment>
    </div>
  );
};

export default Form.create({
  onFieldsChange: debounce((props, changedFields) => {
    const {
      form: { getFieldsValue },
      attributeUpdate,
      isSelectCompInfo,
    } = props;
    const { id, basicStyle } = isSelectCompInfo;
    const newFields = getFieldsValue();
    if (!newFields || JSON.stringify(newFields) === '{}') {
      return;
    }
    // 处理数据
    const newSty = omit(newFields, 'left', 'top', 'height', 'width');
    attributeUpdate({
      id,
      data: {
        compName: isSelectCompInfo.compName,
        type: isSelectCompInfo.type,
        left: newFields.left || 0,
        top: newFields.top || 0,
        height: newFields.height || 0,
        width: newFields.width || 0,
        basicStyle: {
          ...basicStyle,
          ...newSty,
        },
      },
    });
  }, 300),
})(BasicConfig);

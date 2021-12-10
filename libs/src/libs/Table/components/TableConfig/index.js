import { Form, Slider, Switch, InputNumber } from 'antd';
import { useDebounceFn } from '@umijs/hooks';
import InputColor from '../../../../components/InputColor';
import { Fragment, useEffect } from 'react';
import { reap } from '../../../../components/SafeReaper';
// import InputOpacity from '../../../../components/I';
import {
  // opacityTypeName,
  rotateTypeName,
  borderWidthTypeName,
  borderColorTypeName,
  backgroundColoryTypeName,
  linepaddingTypeName,
  borderStyleTypeName,
  borderRadiusTypeName,
  borderSettingEmus,
} from '../../../../helpers/materialconfig';
import BorderSetting from '../../../../components/BorderSetting';
import BorderStyle from '../../../../components/BorderStyle';
import BorderImageSource from '../../../../components/BorderImageSource';
import AllImageIcon from '../../../../components/AllImageIcon';

const MaterialConfig = props => {
  const {
    formItemLayout,
    // color,
    form: { getFieldDecorator, getFieldsValue, resetFields },
    compName,
    updateStyle,
    style,
  } = props;

  useEffect(() => {
    resetFields();
  }, [resetFields, style]);

  const { run } = useDebounceFn(() => {
    _update();
  }, 500);

  const _update = () => {
    let newFields = getFieldsValue();
    updateStyle({
      ...style,
      ...newFields,
    });
  };

  const angleMarks = {
    0: 0,
    180: 180,
    360: 360,
  };

  const borderMarks = {
    0: compName === 'DividingLine' ? 1 : 0,
    50: 50,
    100: 100,
  };

  const leftTopRadius = {
    0: 0,
    250: 250,
    500: 500,
  };

  const borderSetting = reap(style, 'borderSetting', 1);

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      {borderStyleTypeName.includes(compName) && (
        <Form.Item label="边框设置" {...formItemLayout}>
          {getFieldDecorator('borderSetting', {
            initialValue: reap(style, 'borderSetting', 1),
          })(<BorderSetting updateStyle={updateStyle} style={style} />)}
        </Form.Item>
      )}

      {rotateTypeName.includes(compName) && (
        <Form.Item label="旋转角度" {...formItemLayout}>
          {getFieldDecorator('rotate', {
            initialValue: reap(style, 'rotate', 0),
          })(
            <Slider
              max={360}
              marks={angleMarks}
              included={true}
              onChange={e => {
                run();
              }}
            />,
          )}
        </Form.Item>
      )}

      {/* {opacityTypeName.includes(compName) && (
        <Form.Item label="透明度" {...formItemLayout}>
          {getFieldDecorator('opacity', {
            initialValue: reap(style, 'opacity', 1),
          })(
            // <Slider
            //   min={0}
            //   max={1}
            //   step={0.01}
            //   marks={transMarks}
            //   included={true}
            //   onChange={e => {
            //     run();
            //   }}
            // />,
            <InputOpacity updateStyle={updateStyle} style={style} />,
          )}
        </Form.Item>
      )} */}

      {borderWidthTypeName.includes(compName) && borderSetting === borderSettingEmus['simple'] && (
        <Form.Item label="边框宽度" {...formItemLayout}>
          {getFieldDecorator('borderWidth', {
            initialValue: reap(style, 'borderWidth', 0),
          })(
            <Slider
              min={compName === 'DividingLine' ? 1 : 0}
              max={100}
              marks={borderMarks}
              included={true}
              onChange={e => {
                run();
              }}
            />,
          )}
        </Form.Item>
      )}

      {borderColorTypeName.includes(compName) && borderSetting === borderSettingEmus['simple'] && (
        <Form.Item label="边框颜色" {...formItemLayout}>
          {getFieldDecorator('borderColor', {
            initialValue: reap(style, 'borderColor', ''),
          })(
            <InputColor
              color={style.borderColor}
              onChange={e => {
                run();
              }}
            />,
          )}
        </Form.Item>
      )}

      {backgroundColoryTypeName.includes(compName) && (
        <Form.Item label="填充颜色" {...formItemLayout}>
          {getFieldDecorator('backgroundColor', {
            initialValue: reap(style, 'backgroundColor', undefined),
          })(
            <InputColor
              color={style.backgroundColor}
              onBlur={e => {
                run();
              }}
            />,
          )}
        </Form.Item>
      )}

      {borderStyleTypeName.includes(compName) && borderSetting === borderSettingEmus['internal'] && (
        <Form.Item label="请选择边框素材" {...formItemLayout}>
          {getFieldDecorator('borderImageSource', {
            initialValue: reap(style, 'borderImageSource', null),
          })(<BorderImageSource updateStyle={updateStyle} style={style} />)}
        </Form.Item>
      )}

      {borderStyleTypeName.includes(compName) &&
        borderSetting !== borderSettingEmus['none'] &&
        borderSetting !== borderSettingEmus['internal'] && (
          <Form.Item label="边框圆角" {...formItemLayout}>
            {getFieldDecorator('borderRadius', {
              initialValue: reap(style, 'borderRadius', 0),
            })(
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                max={500}
                onChange={e => {
                  run();
                }}
                // color={style.backgroundColor}
                // onBlur={e => {
                //   run();
                // }}
              />,
            )}
          </Form.Item>
        )}

      {linepaddingTypeName.includes(compName) && (
        <Form.Item label="清空线条顶部和左右边距" {...formItemLayout}>
          {getFieldDecorator('linepadding', {
            initialValue: false,
          })(
            <Switch
              onChange={e => {
                run();
              }}
            />,
          )}
        </Form.Item>
      )}

      {borderRadiusTypeName.includes(compName) && (
        <Fragment>
          <Form.Item label="左上圆角" {...formItemLayout}>
            {getFieldDecorator('borderTopLeftRadius', {
              initialValue: reap(style, 'borderTopLeftRadius', ''),
            })(
              <Slider
                min={0}
                max={500}
                marks={leftTopRadius}
                included={true}
                onChange={e => {
                  run();
                }}
              />,
            )}
          </Form.Item>

          <Form.Item label="左下圆角" {...formItemLayout}>
            {getFieldDecorator('borderBottomLeftRadius', {
              initialValue: reap(style, 'borderBottomLeftRadius', ''),
            })(
              <Slider
                min={0}
                max={500}
                marks={leftTopRadius}
                included={true}
                onChange={e => {
                  run();
                }}
              />,
            )}
          </Form.Item>

          <Form.Item label="右上圆角" {...formItemLayout}>
            {getFieldDecorator('borderTopRightRadius', {
              initialValue: reap(style, 'borderTopRightRadius', ''),
            })(
              <Slider
                min={0}
                max={500}
                marks={leftTopRadius}
                included={true}
                onChange={e => {
                  run();
                }}
              />,
            )}
          </Form.Item>

          <Form.Item label="右下圆角" {...formItemLayout}>
            {getFieldDecorator('borderBottomRightRadius', {
              initialValue: reap(style, 'borderBottomRightRadius', ''),
            })(
              <Slider
                min={0}
                max={500}
                marks={leftTopRadius}
                included={true}
                onChange={e => {
                  run();
                }}
              />,
            )}
          </Form.Item>
        </Fragment>
      )}

      {borderStyleTypeName.includes(compName) && borderSetting === borderSettingEmus['simple'] && (
        <Form.Item label="边框样式" {...formItemLayout}>
          {getFieldDecorator('borderStyle', {
            initialValue: reap(style, 'borderStyle', 'solid'),
          })(<BorderStyle updateStyle={updateStyle} style={style} />)}
        </Form.Item>
      )}

      {borderStyleTypeName.includes(compName) && (
        <Form.Item label="背景模糊" {...formItemLayout}>
          {getFieldDecorator('filter', {
            initialValue: reap(style, 'filter', 0),
          })(
            <InputNumber
              min={0}
              max={200}
              style={{ width: '100%' }}
              onChange={e => {
                run();
              }}
            />,
          )}
        </Form.Item>
      )}

      {compName === 'ImageIcon' && (
        <Form.Item label="选择图标" {...formItemLayout}>
          {getFieldDecorator('ImageIcon', {
            initialValue: reap(style, 'ImageIcon', ''),
          })(<AllImageIcon />)}
        </Form.Item>
      )}
    </div>
  );
};

export default Form.create()(MaterialConfig);

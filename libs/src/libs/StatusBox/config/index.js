import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Form, InputNumber, Switch, Select, Row, Input } from 'antd';
import InputColor from '../../../components/InputColor';

const ConfigBorder = forwardRef(props => {
  return <Border {...props} />;
});
const ConfigPadding = forwardRef(props => {
  return <Padding {...props} />;
});
const FormItem = Form.Item;

function StatusBoxConf(props) {
  const {
    form: { getFieldDecorator },
    style,
  } = props;

  return (
    <div>
      <FormItem label="容器宽度">
        {getFieldDecorator('boxWidth', {
          initialValue: style?.boxWidth,
        })(<InputNumber />)}
      </FormItem>
      <FormItem label="容器高度">
        {getFieldDecorator('boxHeight', {
          initialValue: style?.boxHeight,
        })(<InputNumber />)}
      </FormItem>
      <FormItem label="容器背景色">
        {getFieldDecorator('boxBgColor', {
          initialValue: style?.boxBgColor,
        })(<InputColor />)}
      </FormItem>

      <FormItem label="容器圆角">
        {getFieldDecorator('radius', {
          initialValue: style?.radius,
        })(<InputNumber />)}
      </FormItem>

      <FormItem label="容器内边距">
        {getFieldDecorator('Padding', {
          initialValue: style?.Padding || {},
        })(<ConfigPadding />)}
      </FormItem>

      <FormItem label="Item宽度">
        {getFieldDecorator('ItemWidth', {
          initialValue: style?.ItemWidth,
        })(<InputNumber />)}
      </FormItem>
      <FormItem label="Item高度">
        {getFieldDecorator('ItemHeight', {
          initialValue: style?.ItemHeight,
        })(<InputNumber />)}
      </FormItem>

      <Form.Item label="Item Svg (空)">
        {getFieldDecorator('emptySvg', {
          initialValue: style?.emptySvg,
        })(<Input.TextArea />)}
      </Form.Item>

      <Form.Item label="Item Svg (满)">
        {getFieldDecorator('fullSvg', {
          initialValue: style?.fullSvg,
        })(<Input.TextArea />)}
      </Form.Item>

      <FormItem label="Item 右间距">
        {getFieldDecorator('rightDistance', {
          initialValue: style?.rightDistance,
        })(<InputNumber />)}
      </FormItem>
      <FormItem label="Item 下间距">
        {getFieldDecorator('Bottomdistance', {
          initialValue: style?.Bottomdistance,
        })(<InputNumber />)}
      </FormItem>
      {/* <FormItem label="行">
        {getFieldDecorator('row', {
          initialValue: style?.row
        })( <InputNumber /> )}
      </FormItem> */}
      {/* <FormItem label="列">
        {getFieldDecorator('col', {
          initialValue: style?.col,
          rules:[
            {
              required: true
            }
          ]
        })( <InputNumber /> )}
      </FormItem> */}

      <FormItem label="容器是否添加边框">
        {getFieldDecorator('isAddBorder', {
          valuePropName: 'checked',
          initialValue: style?.isAddBorder,
        })(<Switch />)}
      </FormItem>
      {style.isAddBorder && (
        <>
          <FormItem label="边框类型">
            {getFieldDecorator('borderType', {
              initialValue: style?.borderType || 'solid',
            })(
              <Select>
                <Select.Option value="solid">实线</Select.Option>
                <Select.Option value="dashed">虚线</Select.Option>
              </Select>,
            )}
          </FormItem>
          <FormItem key={Math.random()} label="上边框">
            {getFieldDecorator('borderTop', {
              initialValue: style?.borderTop || {},
            })(<ConfigBorder />)}
          </FormItem>
          <FormItem key={Math.random()} label="右边框">
            {getFieldDecorator('borderRight', {
              initialValue: style?.borderRight || {},
            })(<ConfigBorder />)}
          </FormItem>
          <FormItem key={Math.random()} label="下边框">
            {getFieldDecorator('borderBottom', {
              initialValue: style?.borderBottom || {},
            })(<ConfigBorder />)}
          </FormItem>
          <FormItem key={Math.random()} label="左边框">
            {getFieldDecorator('borderLeft', {
              initialValue: style?.borderLeft || {},
            })(<ConfigBorder />)}
          </FormItem>
        </>
      )}
    </div>
  );
}

StatusBoxConf.propTypes = {
  updateStyle: PropTypes.func,
  form: PropTypes.object,
};

export default Form.create({
  onFieldsChange: props => {
    const {
      form: { getFieldsValue },
      updateStyle,
      style,
    } = props;
    const newFields = getFieldsValue();

    updateStyle({
      ...style,
      ...newFields,
      border: {
        borderTop: processBorder(newFields.borderTop, newFields.borderType),
        borderRight: processBorder(newFields.borderRight, newFields.borderType),
        borderBottom: processBorder(newFields.borderBottom, newFields.borderType),
        borderLeft: processBorder(newFields.borderLeft, newFields.borderType),
      },
    });
  },
})(StatusBoxConf);

function Border(props) {
  const { value, onChange } = props;
  return (
    <>
      <InputNumber
        style={{ width: '50px' }}
        min={0}
        value={value.border}
        onBlur={ev => onChange({ ...value, border: ev.target.value })}
      />
      <InputColor
        placeholder="请选择边框颜色"
        value={value.borderColor}
        onBlur={borderColor => onChange({ ...value, borderColor })}
      />
    </>
  );
}
Border.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func,
};

function Padding(props) {
  const { value, onChange } = props;
  return (
    <>
      <Row>
        <span>上</span>
        <InputNumber
          style={{ width: '50px' }}
          min={0}
          value={value.paddingTop}
          onBlur={ev => onChange({ ...value, paddingTop: ev.target.value })}
        />
      </Row>
      <Row>
        <span>下</span>
        <InputNumber
          style={{ width: '50px' }}
          min={0}
          value={value.paddingBottom}
          onBlur={ev => onChange({ ...value, paddingBottom: ev.target.value })}
        />
      </Row>
      <Row>
        <span>左</span>
        <InputNumber
          style={{ width: '50px' }}
          min={0}
          value={value.paddingLeft}
          onBlur={ev => onChange({ ...value, paddingLeft: ev.target.value })}
        />
      </Row>
      <Row>
        <span>右</span>
        <InputNumber
          style={{ width: '50px' }}
          min={0}
          value={value.paddingRight}
          onBlur={ev => onChange({ ...value, paddingRight: ev.target.value })}
        />
      </Row>
    </>
  );
}

Padding.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func,
};

function processBorder(borderObj, borderType) {
  if (borderObj && borderObj.border && borderObj.borderColor) {
    return `${borderObj.border}px ${borderType} ${borderObj.borderColor}`;
  }
  return '';
}

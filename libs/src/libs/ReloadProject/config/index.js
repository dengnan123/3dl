import { useEffect, useState, forwardRef } from 'react';
import { Form, InputNumber, Switch, Button, Row, Col } from 'antd';
// import { debounce } from 'lodash';

const defaultTime = { hour: 0, min: 0, sec: 0 };
function ReloadConfig(props) {
  const {
    // formItemLayout,
    form: { getFieldDecorator, resetFields, validateFields },
    id,
    style,
    updateStyle,
  } = props;

  // const { hour = 0, min = 0, sec = 0, openReload = false } = style || {};
  const { reload = defaultTime, openReload = false } = style || {};
  const [state, setState] = useState([reload]);
  useEffect(() => {
    return () => {
      resetFields();
    };
  }, [resetFields, id, style]);

  useEffect(() => {
    if (Array.isArray(reload)) {
      setState(reload);
    }
  }, [reload]);

  console.log('reload is', reload, '-- state-- ', state);

  // const handleBlurValue = (e, type) => {
  //   validateFields((errors, values) => {
  //     console.log(e.target.value, values);
  //     console.log(type, style);
  //     updateStyle({ ...style, ...values, openReload: true });
  //   });
  // };

  const handleSwichChange = e => {
    console.log(e);
    updateStyle({ ...style, openReload: e });
  };

  // const RenderInput = item => {
  //   return (
  //     <>
  //       <Form.Item label="每天刷新时间 小时（24小时制）" {...formItemLayout}>
  //         {getFieldDecorator('hour', {
  //           initialValue: hour,
  //           rules: [{ required: true, message: '必填' }],
  //         })(<InputNumber min={0} max={23} onBlur={e => handleBlurValue(e, 'hour')} />)}
  //       </Form.Item>
  //       <Form.Item label="分钟" {...formItemLayout}>
  //         {getFieldDecorator('min', {
  //           initialValue: min,
  //           rules: [{ required: true, message: '必填' }],
  //         })(<InputNumber min={0} max={59} onBlur={e => handleBlurValue(e, 'min')} />)}
  //       </Form.Item>
  //       <Form.Item label="秒" {...formItemLayout}>
  //         {getFieldDecorator('sec', {
  //           initialValue: sec,
  //           rules: [{ required: true, message: '必填' }],
  //         })(<InputNumber min={0} max={59} onBlur={e => handleBlurValue(e, 'sec')} />)}
  //       </Form.Item>
  //     </>
  //   );
  // };

  const handleAdd = () => {
    setState(pre => [...pre, defaultTime]);
  };

  const handleSubmit = () => {
    validateFields((errors, values) => {
      console.log(values);
      updateStyle({ ...values });
    });
    // updateStyle({ ...style, reload: state, openReload: true });
  };

  const removeReload = idx => {
    const copy = [...state];
    copy.splice(idx, 1);
    setState(() => copy);

    updateStyle({ ...style, reload: copy, openReload: true });
  };

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Form.Item label="是否开启定时刷新页面">
        {getFieldDecorator('openReload', {
          valuePropName: 'checked',
          initialValue: openReload,
        })(<Switch onChange={e => handleSwichChange(e)} />)}
      </Form.Item>
      {openReload && (
        <>
          {state.map((item, idx) => {
            return (
              <Form.Item
                key={Math.random()}
                label={`刷新时间${idx + 1}`}
                rules={[{ required: true, message: '必填' }]}
              >
                {getFieldDecorator(`reload[${idx}]`, {
                  initialValue: item || {},
                })(<CustomizeComp />)}
                {state.length > 1 && (
                  <Button type="primary" onClick={() => removeReload(idx)}>
                    删除
                  </Button>
                )}
              </Form.Item>
            );
          })}
          <Button type="primary" style={{ marginRight: 20 }} onClick={handleAdd}>
            在添加一个
          </Button>
          <Button type="primary" onClick={handleSubmit}>
            确定
          </Button>
        </>
      )}
    </div>
  );
}

ReloadConfig.propTypes = {};

export default Form.create()(ReloadConfig);

function Customize(props) {
  const { value = {}, onChange } = props;
  return (
    <div>
      <Row gutter={[5, 5]}>
        <Col>
          <span>小时：</span>
          <InputNumber
            min={0}
            max={23}
            value={Number(value.hour)}
            onBlur={ev => onChange({ ...value, hour: ev.target.value })}
          />
        </Col>
        <Col>
          <span>分钟：</span>
          <InputNumber
            min={0}
            max={59}
            value={Number(value.min)}
            onBlur={ev => onChange({ ...value, min: ev.target.value })}
          />
        </Col>
        <Col>
          <span>秒：</span>
          <InputNumber
            min={0}
            max={59}
            value={Number(value.sec)}
            onBlur={ev => onChange({ ...value, sec: ev.target.value })}
          />
        </Col>
      </Row>
    </div>
  );
}

const CustomizeComp = forwardRef((props, ref) => <Customize {...props} />);

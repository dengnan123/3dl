import { Form, Input, Button, Switch } from 'antd';
import { useDebounceFn } from '@umijs/hooks';
import InputColor from '@/components/InputColor';
import { useEffect } from 'react';
import { reap } from '@/components/SafeReaper';

const MaterialConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, getFieldsValue, resetFields, getFieldValue },
    updateStyle,
    style,
    pageConfig,
  } = props;

  useEffect(() => {
    resetFields();
  }, [resetFields, style]);

  const { run } = useDebounceFn(() => {
    _update();
  }, 500);

  const _update = () => {
    let newFields = getFieldsValue();
    updateStyle(newFields);
  };

  const clickBack = () => {
    updateStyle({
      backgroundColor: pageConfig.bgc,
    });
  };

  const backgroundColor = getFieldValue('backgroundColor') || reap(style, 'backgroundColor', '');

  console.log('backgroundColor', backgroundColor);
  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Form.Item label="mapId" {...formItemLayout}>
        {getFieldDecorator('mapId', {
          initialValue: reap(style, 'mapId', ''),
        })(
          <Input
            onBlur={() => {
              run();
            }}
          />,
        )}
      </Form.Item>
      <Form.Item label="地图加载完的背景色" {...formItemLayout}>
        {getFieldDecorator('backgroundColor', {
          initialValue: reap(style, 'backgroundColor', ''),
        })(
          <InputColor
            color={style.backgroundColor}
            onBlur={() => {
              run();
            }}
          />,
        )}
      </Form.Item>
      <Form.Item label="2D/3D切换" {...formItemLayout}>
        {getFieldDecorator('backgroundColor', {
          // initialValue: reap(style, 'backgroundColor', ''),
          // valuePropName: 'checked',
        })(
          <Switch
            onBlur={() => {
              run();
            }}
          />,
        )}
      </Form.Item>
      <Form.Item label="楼层切换" {...formItemLayout}>
        {getFieldDecorator('backgroundColor', {
          // initialValue: reap(style, 'backgroundColor', ''),
          // valuePropName: 'checked',
        })(
          <Switch
            onBlur={() => {
              run();
            }}
          />,
        )}
      </Form.Item>
      <Form.Item label="指北针" {...formItemLayout}>
        {getFieldDecorator('backgroundColor', {
          // initialValue: reap(style, 'backgroundColor', ''),
          // valuePropName: 'checked',
        })(
          <Switch
            onBlur={() => {
              run();
            }}
          />,
        )}
      </Form.Item>
      {<Button onClick={clickBack}>恢复为页面背景色</Button>}
    </div>
  );
};

export default Form.create()(MaterialConfig);

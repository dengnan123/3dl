import MulInputAdd from '@/components/MulInputAdd';
import { Button, Modal, Form, Spin, Input, Icon, message, Switch, Select } from 'antd';

const { Option } = Select;
const ApiForm = ({
  formItemLayout,
  getFieldDecorator,
  nowClick,
  typeArr,
  envList,
  envListValidator,
  datasourceList,
}) => {
  console.log(' nowClick?.sourceList------', nowClick?.sourceList);
  return (
    <Form {...formItemLayout}>
      <Form.Item label="名称">
        {getFieldDecorator('apiHostName', {
          rules: [
            {
              required: true,
              message: '请填写名称',
            },
          ],
          initialValue: nowClick?.apiHostName,
        })(<Input placeholder="请填写名称" />)}
      </Form.Item>

      <Form.Item label="类型" {...formItemLayout} style={{ display: 'none' }}>
        {getFieldDecorator('type', {
          initialValue: 'database',
        })}
      </Form.Item>

      <Form.Item label="环境组">
        {getFieldDecorator('sourceList', {
          // rules: [
          //   {
          //     required: true,
          //     validator: envListValidator,
          //   },
          // ],
          initialValue: nowClick?.sourceList,
        })(
          <MulInputAdd
            envList={envList}
            datasourceList={datasourceList}
            type="database"
          ></MulInputAdd>,
        )}
      </Form.Item>
    </Form>
  );
};

export default ApiForm;

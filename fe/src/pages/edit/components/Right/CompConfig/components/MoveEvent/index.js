import { Form, Select } from 'antd';
import { reap } from '@/components/SafeReaper';
import { debounce } from 'lodash';
import CodeEdit from '@/components/CodeEditOther';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

const { Option } = Select;

const MoveEvent = ({ form, form: { getFieldDecorator }, data, dataSourceList, updateMockData }) => {
  const editProps = {
    update: () => {},
    code: {},
    disCode: false,
    language: 'javascript',
    height: 300,
    width: '100%',
  };

  return (
    <div>
      <Form.Item label="滑动事件" {...formItemLayout}>
        {getFieldDecorator('moveCallbackFunc', {
          initialValue: reap(data, 'moveCallbackFunc', ''),
        })(<CodeEdit {...editProps}></CodeEdit>)}
      </Form.Item>
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
    const { id } = isSelectCompInfo;
    const newFields = getFieldsValue();
    attributeUpdate({
      id,
      data: {},
    });
  }, 500),
})(MoveEvent);

import { Switch, Button, Modal, notification } from 'antd';
import { useState } from 'react';
import AnotherEditor from '../CodeEdit';
import { checkAndTransformCode } from '../../helpers/compile';

const EditECharts = ({ updateStyle, style }) => {
  const [visible, setVisible] = useState(false);

  const onChangeSwitch = checked => {
    updateStyle({ ...style, openOptionsFunc: checked });
  };

  const onCancelModal = () => {
    setVisible(false);
  };

  const update = optionsFuncStr => {
    if (!optionsFuncStr) {
      notification.open({
        message: 'Error',
        description: '请输入函数',
      });
      return;
    }
    const es5Code = checkAndTransformCode(optionsFuncStr);
    if (!es5Code) {
      notification.open({
        message: 'Error',
        description: '函数有误',
      });
      return;
    }
    updateStyle({ ...style, optionsFunc: optionsFuncStr, optionsFuncEs5Code: es5Code });
    onCancelModal();
  };

  const editProps = { update, disCode: false, language: 'javascript', code: style?.optionsFunc };

  return (
    <div style={{ padding: `20px 0`, textAlign: 'left' }}>
      <div>
        <span style={{ marginRight: 5 }}>开启配置拓展:</span>
        <Switch onChange={onChangeSwitch} checked={style?.openOptionsFunc} />
      </div>
      <div style={{ paddingTop: 10 }}>
        {style?.openOptionsFunc && (
          <Button
            onClick={() => {
              setVisible(true);
            }}
          >
            使用配置
          </Button>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 10 }}>
          <a target="blank" href="https://echarts.apache.org/examples/zh/index.html">
            示例地址
          </a>
          <br />
          <a target="blank" href="https://echarts.apache.org/zh/option.html#xAxis.type">
            配置项地址
          </a>
        </div>
      </div>

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
  );
};

export default EditECharts;

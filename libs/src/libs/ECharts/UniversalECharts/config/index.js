import React from 'react';
import { Button, Modal, notification } from 'antd';
import { useState } from 'react';
import AnotherEditor from '../../../../components/CodeEdit';
import { checkAndTransformCode } from '../../../../helpers/compile';

function UniversalEChartConfig({ updateStyle, style }) {
  const [visible, setVisible] = useState(false);

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
      <div style={{ paddingTop: 10 }}>
        <Button
          onClick={() => {
            setVisible(true);
          }}
          block
        >
          Echarts 原生配置
        </Button>

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
}

export default UniversalEChartConfig;

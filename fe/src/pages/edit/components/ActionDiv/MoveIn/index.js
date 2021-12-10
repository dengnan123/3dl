import { Modal } from 'antd';
import { useState } from 'react';
import SelectTree from '@/components/SelectTree';

const MoveIn = ({ visible, handleOk, handleCancel, data: treeData }) => {
  const [data, setData] = useState([]);
  const _ok = () => {
    handleOk && handleOk(data);
  };
  return (
    <Modal
      title="组件移入"
      visible={visible}
      onOk={_ok}
      onCancel={handleCancel}
      destroyOnClose={true}
    >
      <SelectTree data={treeData} onClick={setData}></SelectTree>
    </Modal>
  );
};

export default MoveIn;

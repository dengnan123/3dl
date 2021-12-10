import React, { useState } from 'react';
import { Modal, Input } from 'antd';
import { connect } from 'dva';

// import styles from './index.less';

const Rename = props => {
  const { modalVisible, setModal, updateDataById, renameId, useCompList = [] } = props;

  let isSelectCompInfo = {};
  const arr = useCompList.filter(v => v.id === renameId);
  if (arr.length) {
    isSelectCompInfo = arr[0];
  }

  const [inputStr, setInput] = useState(isSelectCompInfo.aliasName);
  const handleOk = () => {
    setModal(false);
    if (updateDataById) {
      updateDataById({
        id: renameId,
        aliasName: inputStr,
      });
    }
  };

  const handleCancel = () => {
    setModal(false);
  };
  return (
    <Modal
      title="重命名"
      visible={modalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose={true}
    >
      <div>组件名字：{isSelectCompInfo.compName}</div>
      <div>
        别名:
        <Input
          value={inputStr}
          onChange={e => {
            const { value } = e.target;
            setInput(value);
          }}
        ></Input>
      </div>
    </Modal>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    updateDataById: data => {
      dispatch({
        type: 'edit/updateDataById',
        payload: data,
      });
    },
  };
};

export default connect(({ edit, loading }) => {
  return {};
}, mapDispatchToProps)(Rename);

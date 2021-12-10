import React, { useState } from 'react';
import { connect } from 'dva';
import { Form, Modal, Collapse, message } from 'antd';

// import { addEs5CodeToData } from '@/helpers/screen';
import { EditInteractiveOnChangeList } from '@/components';
import EditChangeContent from '@/components/EditChangeContent';

// import MoveEvent from '../MoveEvent';
// import DataSouceList from '../DataSouceList';
import OnClickModal from '../OnClickModal';
import Container from '../Container';
import {
  delwithDynamicExpand,
  getNewDataWithDynamicExpand,
  getFuncAndFuncEs5CodeByKey,
} from './util';

import styles from './index.less';
const { Panel } = Collapse;

const actives = [
  {
    label: 'onChange',
    type: 'onChange',
  },
  {
    label: 'onClick',
    type: 'onClick',
  },
  {
    label: '上滑',
    type: 'moveTop',
  },
  {
    label: '下滑',
    type: 'moveBottom',
  },
  {
    label: '左滑',
    type: 'moveLeft',
  },
  {
    label: '右滑',
    type: 'moveRight',
  },
  {
    label: '容器关联',
    type: 'container',
  },
];

const InteractiveConfig = props => {
  const {
    initUseCompList,
    isSelectCompInfo: initData,
    saveContainerDeps,
    saveDataDeps,
    form,
    form: { getFieldsValue },
    updateDataById,
  } = props;
  const isSelectCompInfo = getNewDataWithDynamicExpand(initData);
  console.log('isSelectCompInfoisSelectCompInfo------', isSelectCompInfo);
  const { id } = isSelectCompInfo;
  const [modalType, setType] = useState(null);
  const [childType, setChildType] = useState(null);
  const { label } = childType || {};

  const onOk = () => {
    let newFields = getFieldsValue();
    const keys = ['moveTop', 'moveBottom', 'moveLeft', 'moveRight'];
    try {
      if (keys.includes(modalType)) {
        const key = `${modalType}Func`;
        const value = newFields[key];
        const nd = getFuncAndFuncEs5CodeByKey(key, value);
        const newdyData = {
          ...isSelectCompInfo.dynamicExpand,
          ...nd,
        };
        console.log('newdyData', newdyData);
        saveDataDeps({
          id,
          data: {
            dynamicExpand: newdyData,
          },
        });
      } else if (modalType === 'onClick') {
        saveDataDeps({
          id,
          data: newFields,
        });
      } else {
        // 处理下数据 onChange
        const { dynamicExpand } = newFields;
        let data = { ...newFields };
        if (dynamicExpand) {
          const newDynamicExpand = delwithDynamicExpand({ dynamicExpand, data: newFields });
          data.dynamicExpand = newDynamicExpand;
        }

        saveDataDeps({
          id,
          data,
        });
      }
      setType(null);
    } catch (e) {
      message.error(e.message);
    }
  };

  const onCancel = () => {
    setType(null);
    setChildType(null);
  };

  const showModal = (key, childKey) => {
    setType(key);
    childKey && setChildType(childKey);
  };

  const clickProps = {
    data: isSelectCompInfo,
    form,
    onCancel,
    onOk,
  };

  const containerProps = {
    onCancel,
    initUseCompList,
    isSelectCompInfo,
    updateDataById,
    saveContainerDeps,
  };

  const modalTitleHash = {
    container: '新增容器关联',
    onChange: label,
    onClick: '回调函数',
  };

  const containerHash = {
    container: <Container {...containerProps}></Container>,
    onChange: <EditChangeContent {...clickProps} childType={childType}></EditChangeContent>,
    onClick: <OnClickModal {...clickProps} fieldKey="onClickCallbackFunc"></OnClickModal>,
    moveTop: <OnClickModal {...clickProps} fieldKey="moveTopFunc"></OnClickModal>,
    moveBottom: <OnClickModal {...clickProps} fieldKey="moveBottomFunc"></OnClickModal>,
  };

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Collapse defaultActiveKey="3">
        <Panel header="onChange" key="3">
          <EditInteractiveOnChangeList
            onShowModal={showModal}
            data={isSelectCompInfo}
            listType={'onChange'}
          />
        </Panel>
        <Panel header="onClick" key="1">
          <EditInteractiveOnChangeList
            onShowModal={showModal}
            data={isSelectCompInfo}
            listType={'onClick'}
          />
        </Panel>
        <Panel header="上滑" key="4">
          <EditInteractiveOnChangeList
            onShowModal={showModal}
            data={isSelectCompInfo}
            listType={'moveTop'}
          />
        </Panel>
        <Panel header="下滑" key="5">
          <EditInteractiveOnChangeList
            onShowModal={showModal}
            data={isSelectCompInfo}
            listType={'moveBottom'}
          />
        </Panel>
        <Panel header="容器关联" key="2">
          <EditInteractiveOnChangeList
            onShowModal={showModal}
            data={isSelectCompInfo}
            listType={'container'}
            noSettingDetail={true}
          />
        </Panel>
      </Collapse>
      <Modal
        title={modalTitleHash[modalType]}
        visible={!!modalType}
        onCancel={onCancel}
        destroyOnClose={true}
        width={860}
        maskClosable={false}
        footer={null}
        className={styles.modal}
      >
        {containerHash[modalType]}
      </Modal>
    </div>
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

export default connect(
  () => {
    return {};
  },
  mapDispatchToProps,
)(Form.create()(InteractiveConfig));

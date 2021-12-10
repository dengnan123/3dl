import React, { useState, useEffect, Fragment } from 'react';
// import router from 'umi/router';
// import PropTypes from 'prop-types';
import { CirclePicker } from 'react-color';
import AddTheme from '../AddTheme';
import HoverList from '@/components/HoverList';
import { Button, message, Modal, Divider, Form, Spin, Icon } from 'antd';
import styles from './index.less';

const delaWithColorObj = obj => {
  return Object.keys(obj)
    .map(v => {
      if (v.includes('color')) {
        return obj[v];
      }
      return null;
    })
    .filter(v => v);
};

const ConfirmModal = ({ value }) => {
  return <div>{`确定删除${value.name}主题吗！！！`}</div>;
};

const Theme = ({
  updateTheme,
  changeTheme,
  isSelectCompInfo,
  updatePageComp,
  confirmLoading,
  modalLoading,
  addTheme,
  deleteTheme,
  form,
  themeList,
  spaning,
  getThemeList,
}) => {
  const [nowTheme, setTheme] = useState(null);
  const [modalVis, setModalVis] = useState(false);
  const [modalType, setType] = useState(null);
  const [nowClick, setNow] = useState({});
  const [isEdit, setEdit] = useState(false);

  useEffect(() => {
    getThemeList();
  }, [getThemeList]);
  const handleCancel = () => {
    setModalVis(false);
    setNow({});
    setEdit(false);
  };
  const handleOk = () => {
    const hash = {
      AddTheme() {
        const fileds = form.getFieldsValue();
        if (isEdit) {
          updateTheme({
            colors: delaWithColorObj(fileds),
            name: fileds.name,
            id: nowClick.id,
          }).then(res => {
            handleCancel();
            getThemeList();
          });
          return;
        }
        addTheme({
          colors: delaWithColorObj(fileds),
          name: fileds.name,
        }).then(res => {
          handleCancel();
          getThemeList();
        });
      },
      ConfirmModal() {
        deleteTheme(nowClick).then(res => {
          setModalVis(false);
          getThemeList();
        });
      },
    };
    if (modalType) {
      hash[modalType]();
    }
  };
  const onChange = v => {
    if (!isSelectCompInfo || JSON.stringify(isSelectCompInfo) === '{}') {
      message.warn('请先选择组件！！！');
      return;
    }
    if (isSelectCompInfo.name === 'Group') {
      message.warn('请选择单一组件！！！');
      return;
    }
    changeTheme({
      id: isSelectCompInfo.id,
      style: {
        ...isSelectCompInfo.style,
        color: v.colors,
      },
    });
    setTheme(v);
  };

  const confirUse = () => {
    if (!nowTheme) {
      message.warn('请选择主题！！！');
      return;
    }
    if (!isSelectCompInfo || JSON.stringify(isSelectCompInfo) === '{}') {
      message.warn('请先选择组件！！！');
      return;
    }
    if (isSelectCompInfo.name === 'Group') {
      message.warn('请选择单一组件！！！');
      return;
    }
    updatePageComp({
      id: isSelectCompInfo.id,
      style: {
        ...isSelectCompInfo.style,
        color: nowTheme.colors,
      },
    });
  };

  const showModal = () => {
    setModalVis(true);
    setType('AddTheme');
  };

  const addThemeProps = {
    form,
    themeInfo: nowClick,
  };

  const hoverListProps = {
    list: themeList,
    renderContent({ v, nowHover }) {
      return (
        <Fragment>
          <div className={styles.title}>
            <span>{v.name}</span>
            <span className={styles.icon}>
              {v.id === nowHover?.id && (
                <span>
                  <Icon
                    type="edit"
                    onClick={() => {
                      setModalVis(true);
                      setType('AddTheme');
                      setNow(v);
                      setEdit(true);
                    }}
                  />
                  <Icon
                    type="delete"
                    onClick={() => {
                      setModalVis(true);
                      setType('ConfirmModal');
                      setNow(v);
                    }}
                  />
                </span>
              )}
            </span>
          </div>
          <div className={styles.content}>
            <CirclePicker
              colors={v.colors}
              onChange={() => {
                onChange(v);
              }}
            ></CirclePicker>
            <Divider></Divider>
          </div>
        </Fragment>
      );
    },
  };

  const confirmModalProps = {
    value: nowClick,
  };

  const modalContent = {
    AddTheme: <AddTheme {...addThemeProps}></AddTheme>,
    ConfirmModal: <ConfirmModal {...confirmModalProps}></ConfirmModal>,
  };

  return (
    <div>
      <Spin spinning={spaning}>
        <HoverList {...hoverListProps}></HoverList>
      </Spin>
      <div className={styles.bottom}>
        <Button type="ghost" onClick={showModal} className={styles.addBtn}>
          新增主题
        </Button>
        <Button type="primary" onClick={confirUse} loading={confirmLoading}>
          确认应用
        </Button>
      </div>

      <Modal
        title="添加主题"
        visible={modalVis}
        onCancel={handleCancel}
        onOk={handleOk}
        width={850}
        destroyOnClose={true}
        maskClosable={false}
        confirmLoading={modalLoading}
      >
        {modalContent[modalType]}
      </Modal>
    </div>
  );
};

export default Form.create()(Theme);

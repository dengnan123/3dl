import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { copyToClip } from '@/helpers/utils';
import { Tooltip, Icon, Popconfirm, Button } from 'antd';
import ParamModal from './ParamModal';
import ParamFastConfigModal from './ParamFastConfigModal';
import styles from './index.less';

function SelectParam(props) {
  const { onChange, value } = props;
  const [{ modalVisible, isEdit, currentData, paramFastConfigModalVisible }, setState] = useState({
    modalVisible: false,
    isEdit: false,
    currentData: null,
    paramFastConfigModalVisible: false,
  });

  const updateState = useCallback(payload => setState(state => ({ ...state, ...payload })), []);

  const handleAddBtnClick = useCallback(() => {
    updateState({ modalVisible: true, currentData: null, isEdit: false });
  }, [updateState]);

  const handleEditBtnClick = useCallback(
    current => {
      updateState({ currentData: current, isEdit: true, modalVisible: true });
    },
    [updateState],
  );

  const handleDelete = useCallback(
    current => {
      const newValue = { ...value };
      delete newValue[current.key];
      onChange && onChange(newValue);
    },
    [value, onChange],
  );

  const handleSubmit = useCallback(
    payload => {
      let newValue = { ...value };
      // 新建
      if (!isEdit) {
        newValue[payload.key] = payload;
        onChange && onChange(newValue);
        updateState({ modalVisible: false });
        return;
      }
      // 编辑
      delete newValue[currentData.key];
      newValue[payload.key] = payload;
      onChange && onChange(newValue);
      updateState({ modalVisible: false });
    },
    [value, isEdit, currentData, updateState, onChange],
  );

  const handleCancel = useCallback(() => {
    updateState({ modalVisible: false });
  }, [updateState]);

  const handleParamFastConfigBtnClick = useCallback(() => {
    updateState({ paramFastConfigModalVisible: true });
  }, [updateState]);

  const paramFastConfigModalOk = useCallback(
    payload => {
      onChange && onChange(payload);
      console.log('payload', typeof payload);
      updateState({ paramFastConfigModalVisible: false });
    },
    [updateState, onChange],
  );

  const paramFastConfigModalCancel = useCallback(() => {
    updateState({ paramFastConfigModalVisible: false });
  }, [updateState]);

  return (
    <section className={styles.selectParam}>
      <div className={styles.operate}>
        <Button type="link" onClick={handleAddBtnClick}>
          添加
        </Button>

        {/* <Button type="link" onClick={handleParamFastConfigBtnClick}>
          快速配置
        </Button> */}
      </div>
      <ul className={styles.list}>
        {Object.keys(value || {})?.map(k => {
          const n = { ...value?.[k], key: k };
          return (
            <li key={k}>
              <Tooltip title={k} placement="topLeft">
                <p className={styles.param} onClick={() => copyToClip(k)}>
                  {k}
                </p>
              </Tooltip>
              <Tooltip title={n?.initValue} placement="topLeft">
                <p>{n?.initValue}</p>
              </Tooltip>
              <Tooltip title={n?.description} placement="topLeft">
                <p>{n?.description}</p>
              </Tooltip>
              <Icon className={styles.edit} type="edit" onClick={() => handleEditBtnClick(n)} />
              <Popconfirm
                title={`确定要删除变量：${k} 吗？`}
                onConfirm={() => handleDelete(n)}
                okText="确定"
                cancelText="取消"
              >
                <Icon className={styles.minus} type="minus-circle" />
              </Popconfirm>
            </li>
          );
        })}
      </ul>

      <ParamModal
        title={isEdit ? '编辑变量' : '新建变量'}
        visible={modalVisible}
        initialValue={currentData}
        onOk={handleSubmit}
        onCancel={handleCancel}
      />
      {/* <ParamFastConfigModal
        visible={paramFastConfigModalVisible}
        onOk={paramFastConfigModalOk}
        onCancel={paramFastConfigModalCancel}
      /> */}
    </section>
  );
}

SelectParam.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.object,
};

export default React.forwardRef((props, ref) => <SelectParam {...props} />);

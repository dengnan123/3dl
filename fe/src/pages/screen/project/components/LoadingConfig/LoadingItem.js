import React, { forwardRef, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Modal, Radio, Empty } from 'antd';

import LoadingDemo from '@/components/InputLoadingStyle/Demo';

import styles from './index.less';

function LoadingItem(props, ref) {
  const { onChange, value, dataSource } = props;
  const [{ selectedItem, visible }, setState] = useState({ selectedItem: null, visible: false });

  const updateState = useCallback(payload => setState(state => ({ ...state, ...payload })), []);

  const handleRadioChange = useCallback(
    e => {
      const id = e.target.value;
      const selectedItem = dataSource?.find(n => n?.id === id);
      updateState({ visible: true, selectedItem });
    },
    [dataSource, updateState],
  );

  const handleClick = useCallback(() => {
    const selectedItem = dataSource?.find(n => n?.id === value);
    updateState({ visible: true, selectedItem });
  }, [value, dataSource, updateState]);

  const handleOk = useCallback(() => {
    updateState({ visible: false });
    onChange && onChange(selectedItem?.id);
  }, [selectedItem, updateState, onChange]);

  const handleCancel = useCallback(() => {
    updateState({ visible: false });
  }, [updateState]);

  const propsSelectItem = useMemo(() => {
    return dataSource?.find(n => n?.id === value);
  }, [value, dataSource]);

  return (
    <>
      <div ref={ref} className={styles.selectLoading} onClick={handleClick}>
        {propsSelectItem?.name ?? <span className={styles.placeholder}>请选择 Loading</span>}
      </div>
      <Modal
        title="选择 Loading"
        visible={visible}
        width={760}
        className={styles.loadingModal}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
      >
        <div className={styles.modalLeft}>
          {selectedItem ? (
            <LoadingDemo value={JSON.parse(selectedItem?.loadingStyle)} />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="请选择先右侧 Loading" />
          )}
        </div>
        <div className={styles.modalRight}>
          <Radio.Group value={selectedItem?.id} onChange={handleRadioChange}>
            {dataSource?.map(n => (
              <Radio value={n?.id} key={n?.id}>
                {n?.name}
              </Radio>
            ))}
          </Radio.Group>
        </div>
      </Modal>
    </>
  );
}

LoadingItem.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  dataSource: PropTypes.array,
};

export default forwardRef(LoadingItem);

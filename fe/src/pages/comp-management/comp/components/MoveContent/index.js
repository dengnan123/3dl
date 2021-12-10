import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Button } from 'antd';

import styles from './index.less';

function MoveContent(props) {
  const { menuList, moveItem, handleCancel, onSubmit, submitLoading } = props;
  const [checkedId, setId] = useState(null);
  useEffect(() => {
    const { pluginTagId } = moveItem || {};
    setId(pluginTagId);
  }, [moveItem]);

  const _onChange = useCallback(e => {
    const { value } = e.target;
    setId(value);
  }, []);

  const SubmitBtnDisabled = useMemo(() => {
    const { pluginTagId } = moveItem || {};
    return checkedId === pluginTagId;
  }, [moveItem, checkedId]);

  const onMoveSubmit = () => {
    onSubmit && onSubmit({ pluginTagId: checkedId });
  };
  return (
    <React.Fragment>
      <div className={styles.contentWrapper}>
        {menuList.map(i => {
          const isChecked = checkedId === i.id;
          return (
            <Checkbox
              checked={isChecked}
              key={i.id}
              disabled={i.id === 'ALL'}
              value={i.id}
              onChange={_onChange}
            >
              {i.name}
            </Checkbox>
          );
        })}
      </div>

      <div className={styles.formBtns}>
        <Button type="default" onClick={handleCancel}>
          取消
        </Button>
        <Button
          type="primary"
          onClick={onMoveSubmit}
          disabled={SubmitBtnDisabled}
          loading={submitLoading}
        >
          移动
        </Button>
      </div>
    </React.Fragment>
  );
}

MoveContent.propTypes = {
  loading: PropTypes.object,
  menuList: PropTypes.array,
  moveItem: PropTypes.object,
  submitLoading: PropTypes.bool,
  handleCancel: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default MoveContent;

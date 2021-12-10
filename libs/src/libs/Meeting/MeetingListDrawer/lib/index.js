import { useCallback, useState, useEffect } from 'react';
import { useMinNoActionDoSome } from '../../../../hooks/util';
import { Drawer } from 'antd';
import MeetingListComp from '../../../../components/MeetingList';
import CloseIcon from '../../../../assets/meeting/standard_list_close_right_bt.png';
import styles from './index.less';

const MeetingListDrawer = ({ data = {}, style = {}, isHidden = false, onChange, getContainer }) => {
  const { title = '会议列表：', openAutoClose = false, autoCloseTime = 10 } = style || {};

  const { title: dTitle } = data || {};

  const [visible, setVisible] = useState(!isHidden);

  useEffect(() => {
    setVisible(!isHidden);
  }, [isHidden]);

  const onClose = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      onChange && onChange({ includeEvents: ['hiddenComps'] });
    }, 300);
  }, [onChange]);

  useMinNoActionDoSome({
    autoCloseTime: openAutoClose ? autoCloseTime : undefined,
    callback: onClose,
  });

  if (isHidden) {
    return null;
  }

  return (
    <Drawer
      visible={visible}
      className={styles.drawer}
      maskClosable={true}
      onClose={onClose}
      getContainer={getContainer}
    >
      <h3 className={styles.title}>{dTitle || title}</h3>
      <i className={styles.closeIcon} onClick={onClose}>
        <img src={CloseIcon} alt="close" />
      </i>
      <div className={styles.list}>
        <MeetingListComp
          style={{
            color: '#757575',
            highlightColor: '#424242',
            fontSize: 30,
            lineHeight: 40,
            spacing: 10,
            arrowSize: 18,
            arrowMarginRight: 10,
          }}
          data={data}
        />
      </div>
    </Drawer>
  );
};

export default MeetingListDrawer;

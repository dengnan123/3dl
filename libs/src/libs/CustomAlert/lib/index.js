import { useEffect, useRef, memo, useState } from 'react';

import { Modal, Button } from 'antd';
import styles from './index.less';

function CustomAlert(props) {
  const { isHidden, onChange, otherCompParams, style } = props;
  const { waiting = 5000 } = style;
  const [content, setContent] = useState('');
  const timer = useRef();
  // const modalTimer = useRef();
  // const modalRef = useRef();

  console.log('CustomAlert revoked', otherCompParams);

  useEffect(() => {
    if (Number(isHidden) === 0) {
      setContent(
        `您所搜索的员工不在本楼层，请到L${otherCompParams?.formParams?.selectData?.floorId}信息屏查询`,
      );
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => {
        onChange &&
          onChange({
            includeEvents: ['showComps', 'hiddenComps', 'passParams', 'callback', 'paramsCache'],
          });
        // if (modalRef.current) {
        //   modalRef.current.destroy();
        //   modalRef.current = null;
        // }
        // Modal.destroyAll();
      }, waiting || 5000);
    }
    // eslint-disable-next-line
  }, [isHidden, otherCompParams]);

  if (isHidden) return null;
  // console.log('CustomAlert --content- 400', content);
  // modalRef.current = Modal.error({
  //   centered: true,
  //   title: '提示',
  //   content: <div style={{ fontSize: '24px', padding: '30px 0' }}>{content}</div>,
  //   okText: '确定',
  //   mask: false,
  //   className: styles.custormAleatContent,
  //   width: 670,
  //   onOk: () => {
  //     // setVisible(false)
  //     if (modalRef.current) {
  //       modalRef.current.destroy();
  //       modalRef.current = null;
  //     }
  //   },
  //   // visible: visible,
  // });
  const handleOk = () => {
    onChange &&
      onChange({
        includeEvents: ['showComps', 'hiddenComps', 'passParams', 'callback', 'paramsCache'],
      });
    if (timer.current) {
      clearTimeout(timer.current);
    }
  };

  // modalTimer.current = setTimeout(() => {
  //   modalRef.current.destroy();
  //   modalRef.current = null;
  //   // setVisible(false);
  // }, waiting || 5000);
  return (
    <Modal
      title="提示"
      className={styles.custormAleatContent}
      visible={true}
      mask={false}
      centered
      style={{ top: '500px' }}
      closable={false}
      footer={[
        <Button type="primary" onClick={handleOk}>
          确定
        </Button>,
      ]}
    >
      <div style={{ fontSize: '24px', padding: '30px 0' }}>{content}</div>
    </Modal>
  );
}

export default memo(CustomAlert);

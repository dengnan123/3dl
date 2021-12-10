import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Modal } from 'antd';

import styles from './index.less';

function PreviewModal(props) {
  const { className, src, poster, type = 'image' } = props;

  const [visible, setVisible] = useState(false);

  return (
    <>
      <div
        className={classnames(styles.view, className)}
        style={{ backgroundImage: `url(${type === 'image' ? src : poster})` }}
        onClick={() => setVisible(true)}
      ></div>
      <Modal
        className={styles.modal}
        centered={true}
        visible={visible}
        onCancel={() => setVisible(false)}
        destroyOnClose={true}
        footer={null}
      >
        {type === 'image' ? (
          <img src={src} alt="" />
        ) : (
          <video src={src} poster={poster} controls="controls" />
        )}
      </Modal>
    </>
  );
}

PreviewModal.propTypes = {
  className: PropTypes.string,
  src: PropTypes.string,
  poster: PropTypes.string,
  type: PropTypes.oneOf(['image', 'video']),
};

export default PreviewModal;

import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useWindowSize } from 'react-use';
import moment from 'dayjs';
import classnames from 'classnames';
import { copyToClip } from '@/helpers/screen';
import { staticPath } from '@/config';
import { Button, Icon } from 'antd';
import defPic from '@/assets/no-pic.png';

import styles from './index.less';

function PageViewModal(props) {
  const { width, height } = useWindowSize();
  const { onClose, onUseTemp, onPrev, onNext, visible, pageInfo, isTemplateShow, onlyRead } = props;

  const {
    id,
    tagId,
    name,
    pageWidth,
    pageHeight,
    pageCoverImg,
    updateTime,
    description,
    layoutType,
  } = pageInfo || {};

  const src = pageCoverImg ? `${staticPath}/${id}/${pageCoverImg}` : defPic;

  const { contentWidth, contentHeight } = useMemo(() => {
    /**
     * @constant 1080 / 1920
     */
    const ratio = 0.5625;

    const ratioW = 1920 / width;
    const ratioH = 1080 / height;

    let w = 1920;
    let h = 1080;

    if (ratioW > ratioH) {
      w = width - 500;
      h = w * ratio;
    } else {
      h = height - 200;
      w = h / ratio;
    }

    return { contentWidth: parseInt(w), contentHeight: parseInt(h) };
  }, [width, height]);

  const handleClose = useCallback(() => {
    onClose && onClose();
  }, [onClose]);

  /**
   * 前往预览
   */
  const handlePreview = useCallback(() => {
    window.open(`${window.location.origin}/preview?pageId=${id}&tagId=${tagId}`);
  }, [id, tagId]);

  /**
   * 前往编辑
   */
  const handleEdit = useCallback(() => {
    window.open(`${window.location.origin}/edit?pageId=${id}&tagId=${tagId}`);
  }, [id, tagId]);

  /**
   * 使用模板
   */
  const handleUseTemp = useCallback(() => {
    onUseTemp && onUseTemp(pageInfo);
  }, [onUseTemp, pageInfo]);

  /**
   * 向前翻
   */
  const handlePrev = useCallback(() => {
    onPrev && onPrev();
  }, [onPrev]);

  /**
   * 向后翻
   */
  const handleNext = useCallback(() => {
    onNext && onNext();
  }, [onNext]);

  const infoList = [
    {
      label: '页面 Id',
      desc: id,
      copyable: true,
    },
    {
      label: '项目 Id',
      desc: tagId,
      copyable: true,
    },
    {
      label: '尺寸',
      desc: `${pageWidth} × ${pageHeight}`,
    },
    {
      label: '更新时间',
      desc: updateTime && moment(updateTime).format('YYYY-MM-DD'),
    },
    {
      label: '布局方式',
      desc: layoutType === 'normal' ? '自由布局' : '栅格布局',
    },
    {
      label: '描述',
      desc: description,
    },
  ];

  if (!visible) return null;
  return (
    <div className={styles.pageView}>
      <div className={styles.close} onClick={handleClose}></div>
      <div className={styles.content}>
        <div
          className={styles.view}
          style={{ width: contentWidth, height: contentHeight, backgroundImage: `url(${src})` }}
        >
          <div className={styles.prev} onClick={handlePrev}>
            <Icon type="left" />
          </div>
          <div className={styles.next} onClick={handleNext}>
            <Icon type="right" />
          </div>
        </div>
        <div className={styles.siderInfo} style={{ height: parseInt(contentHeight * 0.8) }}>
          <h3 className={styles.title}>{name}</h3>
          {infoList?.map((n, i) => (
            <p key={i} className={styles.item}>
              <label className={styles.label}>{n?.label}</label>
              <span
                className={classnames(styles.desc, { [styles.copyable]: n.copyable })}
                onClick={() => (n.copyable ? copyToClip(n?.desc) : null)}
              >
                {n?.desc}
              </span>
            </p>
          ))}

          <Button block type="primary" onClick={handlePreview}>
            预览
          </Button>
          {!isTemplateShow && (
            <Button block style={{ marginTop: 10 }} onClick={handleEdit} disabled={onlyRead}>
              编辑
            </Button>
          )}
          <Button block style={{ marginTop: 10 }} onClick={handleUseTemp} disabled={onlyRead}>
            使用模板
          </Button>
        </div>
      </div>
      <div className={styles.mask}></div>
    </div>
  );
}

PageViewModal.propTypes = {
  onClose: PropTypes.func,
  onUseTemp: PropTypes.func,
  onPrev: PropTypes.func,
  onNext: PropTypes.func,
  visible: PropTypes.bool,
  pageInfo: PropTypes.object,
};

export default PageViewModal;

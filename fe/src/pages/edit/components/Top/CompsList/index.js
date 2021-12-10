import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { Icon } from 'antd';

import { getCompStaticData } from '@/helpers/screen';
import { API_HOST } from '@/config';
import NoPicture from '../../../../../assets/no-pic.png';

import styles from './index.less';

const BigCardHeight = 300;
export default props => {
  const { visible, compMenuList, getPluginMenu, addCusCompToUseCompList } = props;
  const [hoverItem, setHoverItem] = useState(null);
  const [cardTop, setTop] = useState(0);

  useEffect(() => {
    if (!visible) {
      setHoverItem(null);
    }
  }, [visible]);

  useEffect(() => {
    getPluginMenu();
  }, [getPluginMenu]);

  const onClick = useCallback(
    async value => {
      const { compName } = value;
      console.log('onClick....valuevaluevaluevalue', value);
      const mockData = (await getCompStaticData(compName)) || {};
      addCusCompToUseCompList({
        ...value,
        mockData,
      });
    },
    [addCusCompToUseCompList],
  );

  const classifyHeight = window.innerHeight - 60;

  const onCompHover = useCallback(
    (item, nodeId) => {
      setHoverItem(item);
      const classifyNode = document.getElementById('classifyContainer');
      const itemNode = document.getElementById(nodeId);
      if (!classifyNode || !itemNode) {
        return;
      }

      const classifyScrollTop = classifyNode.scrollTop;
      const itemTop = itemNode.offsetTop;
      const top = itemTop - classifyScrollTop;
      let bigCardTop = top;
      if (top < 0) {
        bigCardTop = 0;
      }
      if (bigCardTop + BigCardHeight > classifyHeight) {
        bigCardTop = classifyHeight - BigCardHeight;
      }

      setTop(bigCardTop);
    },
    [classifyHeight],
  );

  // 组件Card
  const renderChildren = useCallback(
    (child, nodeId) => {
      if (!child || !child.length) {
        return <span>该分类还未添加组件！</span>;
      }
      const childrenArr = child.map(item => {
        const { id, label, compName, pluginImageSrc } = item;
        let src = `${API_HOST}/static/plugin/${pluginImageSrc}`;
        if (!pluginImageSrc) {
          src = NoPicture;
        }
        return (
          <div
            key={id}
            className={styles.childItem}
            onMouseOver={() => onCompHover(item, nodeId)}
            onClick={() => onClick(item)}
          >
            <img src={src} alt={compName} />
            <p>{label}</p>
          </div>
        );
      });
      return childrenArr;
    },
    [onCompHover, onClick],
  );

  // 分类项
  const RenderClassify = useMemo(() => {
    const isNone = !visible || !compMenuList.length;
    const contentArr = compMenuList.map(item => {
      const { id, label, child } = item;
      const nodeId = `classifyItem-${id}`;
      return (
        <div key={id} className={styles.classify} id={nodeId}>
          <h3>
            <Icon type="appstore" style={{ marginRight: 5 }} />
            {label}
          </h3>
          <div>{renderChildren(child, nodeId)}</div>
        </div>
      );
    });
    return (
      <div
        id="classifyContainer"
        className={styles.listContainer}
        style={{
          maxHeight: classifyHeight,
          display: isNone ? 'none' : 'block',
        }}
      >
        {contentArr}
      </div>
    );
  }, [visible, compMenuList, classifyHeight, renderChildren]);

  // 右侧大Card
  const RenderBigCardContent = useMemo(() => {
    if (!visible || !hoverItem) {
      return;
    }
    const { label, compName, pluginImageSrc } = hoverItem;
    let src = `${API_HOST}/static/plugin/${pluginImageSrc}`;
    if (!pluginImageSrc) {
      src = NoPicture;
    }
    return (
      <div
        className={styles.itemBigCard}
        style={{
          width: 400,
          height: BigCardHeight,
          top: cardTop,
        }}
      >
        <h3>
          预览: {label}
          <span style={{ marginLeft: 5, color: '#999999' }}>({compName})</span>
        </h3>
        <div>
          <img src={src} alt={compName} />
        </div>
      </div>
    );
  }, [visible, cardTop, hoverItem]);

  return (
    <div className={styles.compWrapper}>
      {RenderClassify}
      {RenderBigCardContent}
    </div>
  );
};

import React, { useState, Fragment } from 'react';
import classnames from 'classnames';
import { sortArrByZindex } from '@/helpers/utils';
import { Tree } from 'antd';

import styles from './index.less';

const { TreeNode } = Tree;

const hasMulId = (mulArr = [], id) => {
  for (const v of mulArr) {
    if (v === id) {
      return true;
    }
  }
  return false;
};

export default function HoverTree({
  list,
  renderTitleLeft,
  renderTitleRight,
  renderContent,
  clickStyle,
  hoverStyle,
  normalStyle,
  propsClickId,
  propsClickIdList,
  expandedKeys,
  onExpand,
  handleExpandedAll,
}) {
  const [nowHover, setHover] = useState();
  const [hoverIndex, setIndex] = useState(null);
  const [nowClick, setClick] = useState();
  const [clickIndex, setClickIndex] = useState();

  const onMouseEnter = (v, index) => {
    setHover(v);
    setIndex(index);
  };

  const onMouseLeave = () => {
    setHover({});
  };
  const nowClickId = nowClick?.id;
  const nowHoverId = nowHover?.id;
  const childId = propsClickId;

  const getItemStyle = id => {
    if (propsClickIdList?.length) {
      // 多选优先
      if (hasMulId(propsClickIdList, id)) {
        return clickStyle;
      }
      return normalStyle;
    }

    if (childId === id) {
      return clickStyle;
    }
    if (nowHoverId === id) {
      return hoverStyle;
    }
    return normalStyle || {};
  };

  const renderTreeNode = list => {
    return (list || []).map((v, index) => {
      const { child: initChild, id } = v;
      if (initChild && initChild.length) {
        const child = sortArrByZindex(initChild);
        return (
          <TreeNode
            title={
              <div
                id={id}
                className={classnames(getItemStyle(id))}
                onMouseEnter={() => {
                  onMouseEnter(v, index);
                }}
                onMouseLeave={onMouseLeave}
                onClick={e => {
                  e.stopPropagation();
                  setClick(v);
                  setClickIndex(index);
                }}
              >
                {renderContent({
                  v,
                  nowHover,
                  index,
                  hoverIndex,
                  nowClick,
                  clickIndex,
                })}
              </div>
            }
            key={id}
          >
            {renderTreeNode(child)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          title={
            <div
              id={id}
              className={classnames(getItemStyle(id))}
              onMouseEnter={() => {
                onMouseEnter(v, index);
              }}
              onMouseLeave={onMouseLeave}
              onClick={e => {
                e.stopPropagation();
                setClick(v);
                setClickIndex(index);
              }}
            >
              {renderContent({
                v,
                nowHover,
                index,
                hoverIndex,
                nowClick,
                clickIndex,
              })}
            </div>
          }
          key={id}
        ></TreeNode>
      );
    });
  };

  const sortList = sortArrByZindex(list);

  return (
    <Fragment>
      <Tree
        showLine={false}
        showIcon={true}
        selectedKeys={[nowClickId]}
        expandedKeys={expandedKeys}
        onExpand={onExpand}
        className={styles.tree}
      >
        {renderTreeNode(sortList)}
      </Tree>
    </Fragment>
  );
}

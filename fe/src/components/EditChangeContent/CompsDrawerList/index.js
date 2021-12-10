import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Spin, Icon, Button } from 'antd';
import classnames from 'classnames';

import { fetchPageUseCompList } from '@/service';
import { copyToClip } from '@/helpers/screen';

import styles from './index.less';

export default props => {
  const { pages, currentPageId, currentPageComps } = props;

  // 各个页面组件数据
  const [compsObject, setCompList] = useState({});
  const [openIds, setOpenIds] = useState([]);
  const [loadingBool, setLoading] = useState(false);
  //  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (currentPageId || currentPageComps) {
      setCompList({ [currentPageId]: currentPageComps });
      setOpenIds([Number(currentPageId)]);
    }
  }, [currentPageId, currentPageComps]);

  /** 请求数据(组件列表) **/
  const queryComps = useCallback(
    id => {
      const compArr = compsObject[id];
      if (compArr) return;
      setLoading(true);
      fetchPageUseCompList({ pageId: id, type: 'edit' }).then(res => {
        const { errorCode, data } = res || {};
        setLoading(false);
        if (errorCode === 200) {
          setCompList(list => {
            return {
              ...list,
              [id]: data || [],
            };
          });
        }
      });
    },
    [compsObject],
  );
  /** 请求数据(组件列表) **/

  const onPageClick = useCallback(
    id => {
      let ids = [...openIds];
      if (!openIds.includes(id)) {
        queryComps(id);
        ids = [...ids, id];
      } else {
        ids = ids.filter(i => i !== id);
      }
      setOpenIds(ids);
    },
    [queryComps, openIds, currentPageId],
  );

  const renderCompDiv = useCallback(list => {
    if (!list || !list.length) {
      return <div className={styles.noDataTips}>该页面尚未添加组件！</div>;
    }
    return (list || []).map(v => {
      const name = v.aliasName || v.compName;
      return (
        <div>
          <span>{name}</span>
          --
          <Button
            type="link"
            onClick={() => {
              copyToClip(v.id);
            }}
          >
            {v.id}
          </Button>
        </div>
      );
    });
  }, []);

  // 渲染每个页面的选择的组件
  const RenderPageListContent = useMemo(() => {
    let pagesArr = [];
    let currentPage = null;

    for (let page of pages) {
      const { id, name } = page;
      const isCurrentPage = id + '' === currentPageId;
      const isActive = openIds.includes(id);
      const isLast = isActive && id === openIds.slice(-1)[0];
      const currentCompsArr = compsObject[id] || [];
      const compsListData = getDataSource(currentCompsArr);
      const itemContent = (
        <div className={styles.pageItem} key={id}>
          <h3
            onClick={() => onPageClick(id)}
            className={classnames(
              { [styles.active]: isActive },
              { [styles.current]: isCurrentPage },
            )}
          >
            {id} - {name}
            <span className={classnames(styles.titleIcon, { [styles.active]: isActive })}>
              <Icon type="down" />
            </span>
          </h3>
          {isActive && (
            <Spin spinning={loadingBool && isLast}>
              <div className={styles.pageItemComps}>{renderCompDiv(compsListData)}</div>
            </Spin>
          )}
        </div>
      );
      if (isCurrentPage) {
        currentPage = itemContent;
        continue;
      }

      pagesArr.push(itemContent);
    }

    return [currentPage, ...pagesArr];
  }, [pages, currentPageId, compsObject, renderCompDiv, onPageClick, openIds, loadingBool]);

  return <div className={styles.pageListContent}>{RenderPageListContent}</div>;
};

const getDataSource = (list = []) => {
  let arr = [];
  list.forEach(item => {
    arr.push(item);
    if (item.child && item.child.length) {
      arr = [...arr, ...getDataSource(item.child)];
    }
  });
  return arr;
};

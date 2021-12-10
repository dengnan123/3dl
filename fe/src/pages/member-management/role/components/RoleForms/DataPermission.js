import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Icon, Checkbox, Spin } from 'antd';
import classnames from 'classnames';

import { fetchPageList } from '@/service';
import styles from './index.less';

const params = { current: 1, pageSize: 999 };

const renderOptions = children => {
  const options = children.map(i => {
    return {
      label: i.name,
      value: i.id,
    };
  });
  return options;
};

function DataPermission(props) {
  const { projects, tagIdList, pageIdData, onClickAll, onClickSingle } = props;
  // childrenHash：项目子页面hash  {list:[], ids:[]}
  const [childrenHash, setChildrenHash] = useState({});
  const [currentTag, setCurrentTag] = useState(null);
  const [queryLoading, setLoading] = useState(false);

  // 查找子页面，若之前请求过，则只做关闭展开操作，否则请求数据
  const queryChildren = useCallback(
    id => {
      const childrenArr = childrenHash[id];
      if (id !== currentTag) {
        setCurrentTag(id);
      } else {
        setCurrentTag(null);
      }

      if (childrenArr) {
        return;
      }
      setLoading(true);
      fetchPageList({ ...params, tagId: id }).then(res => {
        const { errorCode, data } = res || {};
        setLoading(false);

        if (errorCode === 200) {
          const { list } = data;
          const listIds = (list || []).map(i => i.id);
          let newHash = { ...childrenHash };
          newHash[id] = { list, ids: listIds };
          setChildrenHash(newHash);
        }
      });
    },
    [currentTag, childrenHash],
  );

  const getCurrentCheckedPageIds = useCallback(
    pId => {
      // 如果选择了整个项目，则返回所有的子页面ID，否则返回选中的idList
      let checkedList = pageIdData[pId] || [];
      let indeterminate = false;

      const { ids } = childrenHash[pId] || {};
      if (checkedList.length) {
        indeterminate = true;
      }
      if (tagIdList.includes(pId)) {
        checkedList = ids;
        indeterminate = false;
      }
      return { checkedList, indeterminate };
    },
    [childrenHash, tagIdList, pageIdData],
  );

  const RenderProjects = useMemo(() => {
    const projectItems = projects.map(item => {
      const { id, name } = item;
      const isCheckedAll = tagIdList.includes(id);
      const { list: itemChildren } = childrenHash[id] || {};
      const isCurrent = currentTag === id;
      // itemChildren存在代表请求过数据，itemChildren为空数组，则提示无页面
      const isHasChildren = itemChildren && itemChildren.length > 0;
      const isChildrenEmpty = itemChildren && itemChildren.length === 0;
      // 获取子页面checkedList 以及 Checkbox是否为半选状态
      const { checkedList, indeterminate } = getCurrentCheckedPageIds(id);
      return (
        <div key={id} className={styles.pItem}>
          <Checkbox
            indeterminate={indeterminate}
            onChange={e => onClickAll(e, id)}
            checked={isCheckedAll}
          >
            {name}
          </Checkbox>
          <div className={styles.detailBtn} onClick={() => queryChildren(id)}>
            {isCurrent ? <Icon type="minus-square" /> : <Icon type="plus-square" />}
          </div>
          <Spin spinning={isCurrent && queryLoading} size="small">
            <div className={classnames(styles.childrenList, { [styles.show]: isCurrent })}>
              {isHasChildren && (
                <Checkbox.Group
                  options={renderOptions(itemChildren)}
                  value={checkedList}
                  onChange={checkedList => onClickSingle(checkedList, id)}
                />
              )}
              {isChildrenEmpty && <p className={styles.emptyTip}>该项目暂无页面!</p>}
            </div>
          </Spin>
        </div>
      );
    });
    return projectItems;
  }, [
    projects,
    childrenHash,
    tagIdList,
    currentTag,
    queryLoading,
    onClickAll,
    onClickSingle,
    queryChildren,
  ]);

  return <div className={styles.permContent}>{RenderProjects}</div>;
}

DataPermission.propTypes = {
  projects: PropTypes.array,
  tagIdList: PropTypes.array,
  pageIdData: PropTypes.object,
  onClickAll: PropTypes.func,
  onClickSingle: PropTypes.func,
};

export default DataPermission;

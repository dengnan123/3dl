import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useDebounce } from '@react-hook/debounce';
import cloneDeep from 'lodash/cloneDeep';
import { OpenIcon } from '@/assets/svg/index';
import { Button, Icon, Input } from 'antd';
import HoverTree from '@/components/HoverTree';
import styles from './index.less';
import classnames from 'classnames';

const { Search } = Input;

function shouldSave(data, keywords) {
  let save = false;

  function _find(data, keywords) {
    for (let n of data) {
      const { compName, aliasName } = n;
      const matched = `${compName}${aliasName}`
        .toLowerCase()
        .includes((keywords || '').trim().toLowerCase());
      if (matched) {
        save = true;
        return;
      }
      if (n.child) {
        _find(n.child, keywords);
      }
    }
  }

  _find(data, keywords);

  return save;
}

export default props => {
  const {
    onlyUpdateChangeData,
    useCompList,
    setDoGroup,
    setCancelGroup,
    isPress,
    updateMulArr,
    isSelectCompInfo,
    hiddenComp,
    updateState,
    setClickIdForLine,
    setmulArrIdForLine,
    mulIdArrForLine,
  } = props;

  const clickId = isSelectCompInfo.id;
  const [keywords, setKeywords] = useDebounce(undefined, 800);
  const [{ expandedAll, expandedKeys, allKeys, rootKeyList }, setExpanded] = useState({
    expandedAll: true,
    expandedKeys: [],
    allKeys: [],
    rootKeyList: [],
  });
  const listRef = useRef();
  useEffect(() => {
    let newExpandedKeys = expandedKeys;
    if (!listRef.current && useCompList) {
      const allKeys = getAllKeys(useCompList);
      newExpandedKeys = allKeys;
      setExpanded(v => ({ ...v, expandedKeys: allKeys }));
    }
    if (!listRef.current || JSON.stringify(listRef.current) !== JSON.stringify(useCompList)) {
      listRef.current = useCompList;
      const allKeys = getAllKeys(useCompList);
      const rootKeyList = (useCompList || [])
        .map(n => {
          if (n.child && !!n.child.length) {
            return n.id;
          }
          return null;
        })
        .filter(key => key);

      setExpanded(v => {
        const expandedAll = calcExpandedAll(rootKeyList, newExpandedKeys, v.expandedAll);
        return { ...v, allKeys, rootKeyList, expandedAll };
      });
    }
  }, [useCompList, expandedKeys]);

  // 选中图层滚动到可视区域
  useEffect(() => {
    // 选中图层div
    let activeItemDom;
    if (!clickId) return;
    activeItemDom = document.getElementById(clickId);
    if (!activeItemDom) return;
    activeItemDom.scrollIntoViewIfNeeded && activeItemDom.scrollIntoViewIfNeeded();
  }, [clickId]);

  const onExpand = useCallback(
    (expandedKeys, { expanded }) => {
      setExpanded(v => {
        const expandedAll = calcExpandedAll(rootKeyList, expandedKeys, v.expandedAll);
        return { ...v, expandedKeys, expandedAll };
      });
    },
    [rootKeyList],
  );

  const handleExpandedAll = useCallback(() => {
    const newExpandedAll = !expandedAll;
    const newExpandedKeys = newExpandedAll ? allKeys : [];
    setExpanded(v => ({ ...v, expandedAll: newExpandedAll, expandedKeys: newExpandedKeys }));
  }, [expandedAll, allKeys]);

  const onSearchChange = useCallback(
    e => {
      const value = e.target.value;
      setKeywords(value);
    },
    [setKeywords],
  );

  const sortCompList = useMemo(() => {
    let dealData = cloneDeep(useCompList || []).sort(function(a, b) {
      return b.zIndex - a.zIndex;
    });
    function findData(data = [], keywords) {
      for (let i = 0; i < data.length; i++) {
        const n = data[i];
        const save = shouldSave([n], keywords);
        if (n.child) {
          findData(n.child, keywords);
        }
        if (!save) {
          data.splice(i, 1);
          i--;
        }
      }
    }
    if (keywords) {
      findData(dealData, keywords);
    }

    return dealData;
  }, [useCompList, keywords]);

  const onMouseUp = ({ id, left, top }) => {
    // 判断鼠标右击的时候 没有child 不能显示取消成组
    for (const value of useCompList) {
      if (value.id === id) {
        const { child } = value;
        // 取消成组 显示限制
        if (!child || !child.length) {
          //
          setCancelGroup(true);
        } else {
          setCancelGroup(false);
        }

        // 成组显示限制
        if (mulIdArrForLine.length < 2) {
          setDoGroup(true);
        } else {
          setDoGroup(false);
        }
        break;
      }
    }
  };

  const onClick = v => {
    const { id } = v;
    updateState({
      isSelectCompInfo: v,
    });
    if (isPress) {
      updateMulArr({
        id,
      });
      setmulArrIdForLine(id);
      return;
    }
    setClickIdForLine(id);
  };

  const unlock = id => {
    onlyUpdateChangeData({
      id,
      data: {
        isLocking: 0,
      },
    });
  };

  const show = id => {
    hiddenComp({
      id: clickId,
      isHidden: 0,
    });
  };

  const hoverTreeProps = {
    list: sortCompList,
    renderContent({ v }) {
      const { id, compName, aliasName, isHidden, isLocking } = v;
      return (
        <div
          key={id}
          className={classnames(isLocking ? styles.lockStyle : {})}
          onMouseUp={e => {
            // 鼠标右击
            if (e.button === 2) {
              onMouseUp({
                id,
                top: e.clientY,
                left: e.clientX,
              });
            }
          }}
          onClick={e => {
            onClick(v);
          }}
        >
          <div
            style={{
              position: 'relative',
            }}
          >
            <span>{aliasName ? aliasName : compName}</span>
            <span className={styles.iconDiv}>
              {isLocking ? (
                <Button
                  type="link"
                  onClick={() => {
                    unlock(id);
                  }}
                >
                  <Icon type="lock" />
                </Button>
              ) : null}

              {isHidden ? (
                <Button
                  type="link"
                  onClick={() => {
                    show(id);
                  }}
                >
                  <Icon type="eye-invisible" />
                </Button>
              ) : null}
            </span>
          </div>
        </div>
      );
    },
    propsClickId: clickId,
    propsClickIdList: mulIdArrForLine,
    clickStyle: styles.clickItemaDiv,
    hoverStyle: styles.hoverItemaDiv,
    normalStyle: styles.itemDiv,
    expandedKeys,
    onExpand,
    handleExpandedAll,
  };

  return (
    <div
      className={styles.layerDiv}
      id="layerDiv"
      style={{
        height: window.innerHeight - 80 - 45,
      }}
    >
      <div className={styles.search}>
        <Search
          placeholder="组名、组件名"
          onChange={onSearchChange}
          style={{ width: 'calc(100% - 45px)' }}
        />
        <Button
          type="link"
          disabled={!rootKeyList.length}
          onClick={handleExpandedAll}
          className={styles.btn}
        >
          <OpenIcon
            className={classnames({
              [styles.packUp]: expandedAll,
              [styles.disabled]: !rootKeyList.length,
            })}
          />
        </Button>
      </div>
      <div className={styles.scrollContent}>
        <HoverTree {...hoverTreeProps} />
      </div>
    </div>
  );
};

function getAllKeys(list) {
  const ids = [];
  function getList(arr, result = []) {
    for (let v of arr) {
      if (v.child && !!v.child.length) {
        result.push(v.id);
        getList(v.child, result);
      }
    }
  }
  getList(list, ids);
  return ids;
}

function calcExpandedAll(rootKeyList, expandedKeys, expandedAll) {
  let currentRootKeyLength = 0;
  let newExpandedAll = expandedAll;
  rootKeyList.forEach(n => {
    if (expandedKeys.includes(n)) {
      currentRootKeyLength++;
    }
  });
  if (currentRootKeyLength === rootKeyList.length) {
    newExpandedAll = true;
    return newExpandedAll;
  }
  if (currentRootKeyLength === 0) {
    newExpandedAll = false;
    return newExpandedAll;
  }
  return expandedAll;
}

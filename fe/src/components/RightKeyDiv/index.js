import React, { useState, useRef, useMemo, useEffect } from 'react';
import ReactDom from 'react-dom';
import { Modal } from 'antd';
import { hasLocking } from '@/helpers/status';
import { copyToClip } from '@/helpers/screen';
import { getHiddenActionListById } from '@/helpers/view';
import styles from './index.less';

const RightKeyDiv = props => {
  const divRef = useRef(null);
  const [{ menuWidth, menuHeight }, setMenuDiv] = useState({ menuWidth: 0, menuHeight: 0 });
  const {
    left,
    top,
    clickId,
    sortCompList,
    setVis,
    setAlwaysShowHoverID,
    doGroup,
    cancelGroup,
    hiddenDoGroup,
    hiddenCancelGroup,
    cvApi,
    setModal,
    setRenameId,
    cvToOtherApi,
    setShowDrawerType,
    lookConfig,
    saveStyleToTheme,
    hiddenComp,
    updateIndex,
    onlyUpdateChangeData,
    moveOut,
    pageConfig,
  } = props;

  const isLocking = hasLocking({
    id: clickId,
    useCompList: sortCompList,
  });

  const [hoverName, setName] = useState(null);

  const showHover = hoverName => {
    setName(hoverName);
  };
  const showRefLine = id => {
    setAlwaysShowHoverID(id);
  };

  const locking = id => {
    onlyUpdateChangeData({
      id: clickId,
      data: {
        isLocking: 1,
      },
    });
  };

  const unlock = id => {
    onlyUpdateChangeData({
      id: clickId,
      data: {
        isLocking: 0,
      },
    });
  };

  const hidden = id => {
    hiddenComp({
      id: clickId,
      isHidden: 1,
    });
  };

  const show = id => {
    hiddenComp({
      id: clickId,
      isHidden: 0,
    });
  };

  const _moveOut = () => {
    Modal.confirm({
      title: 'Confirm',
      content: '是否把组件移出到最外层！',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        moveOut();
      },
    });
  };

  const eventArr = [
    {
      eventName: 'setAliasName',
      name: '重命名',
    },
    {
      eventName: 'saveStyleToTheme',
      name: '发布到主题库',
    },
    {
      eventName: 'locking',
      name: '锁定',
    },
    {
      eventName: 'unlock',
      name: '解锁',
    },
    {
      eventName: 'hidden',
      name: '隐藏',
    },
    {
      eventName: 'show',
      name: '显示',
    },
    {
      eventName: 'doGroup',
      name: '成组',
    },
    {
      eventName: 'cancelGroup',
      name: '取消成组',
    },
    {
      eventName: 'cv',
      name: '复制',
    },
    {
      eventName: 'cvToOther',
      name: '复制到其他大屏',
    },
    {
      eventName: '_moveOut',
      name: '移出',
    },
    // {
    //   eventName: 'changeToOtherChart',
    //   name: '更换图表',
    // },
    {
      eventName: 'toTop',
      name: '置顶',
    },
    {
      eventName: 'toBottom',
      name: '置底',
    },
    {
      eventName: 'toUpperLevel',
      name: '上移',
    },
    {
      eventName: 'toLowLevel',
      name: '下移',
    },
  ];

  const copyCompId = clickID => {
    copyToClip(clickID);
  };

  const changeToOtherChart = () => {
    setShowDrawerType();
  };

  const setAliasName = id => {
    if (setModal) {
      setModal(true);
      setRenameId(id);
    }
  };

  const _cancelGroup = () => {
    cancelGroup(clickId);
  };

  const cv = clickID => {
    console.log('复制图标', clickID);
    cvApi({
      id: clickID,
    });
  };

  const cvToOther = () => {
    cvToOtherApi(clickId);
  };

  const clickTo = eventName => {
    const obj = {
      toTop: 1,
      toBottom: 1,
      toUpperLevel: 1,
      toLowLevel: 1,
    };
    const otherObj = {
      showRefLine,
      doGroup,
      cancelGroup: _cancelGroup,
      cv,
      setAliasName,
      locking,
      unlock,
      hidden,
      show,
      cvToOther,
      changeToOtherChart,
      lookConfig,
      saveStyleToTheme,
      copyCompId,
      _moveOut,
    };
    if (obj[eventName]) {
      updateIndex &&
        updateIndex({
          eventName,
        });
    }
    if (otherObj[eventName]) {
      otherObj[eventName](clickId);
    }
    setVis(false);
  };

  const onMouseLeave = () => {
    setVis(false);
  };

  const initEventArr = getHiddenActionListById({
    eventArr,
    id: clickId,
    initUseCompList: sortCompList,
    pageConfig,
  });

  //根据条件过滤
  const _eventArr = initEventArr.filter(v => {
    if (v.eventName === 'doGroup') {
      if (hiddenDoGroup) {
        return false;
      }
      if (pageConfig.layoutType === 'grid') {
        return false;
      }
    }
    if (v.eventName === 'cancelGroup') {
      if (hiddenCancelGroup) {
        return false;
      }
      if (pageConfig.layoutType === 'grid') {
        return false;
      }
    }
    if (isLocking && v.eventName === 'locking') {
      return false;
    }
    if (!isLocking && v.eventName === 'unlock') {
      return false;
    }
    return true;
  });

  useEffect(() => {
    const menuWidth = divRef.current.offsetWidth;
    const menuHeight = divRef.current.offsetHeight;
    setMenuDiv({ menuWidth, menuHeight });
  }, []);

  const { left: l, top: t } = useMemo(() => {
    return getMenuPosition(left, top, menuWidth, menuHeight);
  }, [left, top, menuWidth, menuHeight]);

  return ReactDom.createPortal(
    <div
      className={styles.rightClickDiv}
      style={{ left: l, top: t }}
      onMouseLeave={onMouseLeave}
      ref={divRef}
    >
      {_eventArr.map((v, index) => {
        return (
          <div
            key={index}
            onClick={e => {
              e.stopPropagation();
              clickTo(v.eventName);
            }}
            onMouseEnter={() => {
              showHover(v.eventName);
            }}
            className={hoverName === v.eventName ? styles.hoverDiv : {}}
          >
            {v.name}
          </div>
        );
      })}
    </div>,
    document.body,
  );
};

export default RightKeyDiv;

function getMenuPosition(left, top, menuWidth, menuHeight) {
  // 水平偏移距离
  const offsetX = 10;
  // 可视区域宽度、高度
  const clientWidth = document.body.clientWidth;
  const clientHeight = document.body.clientHeight;

  let curLeft = left + offsetX;
  let curTop = top;

  if (curLeft + menuWidth > clientWidth) {
    curLeft = left - menuWidth - offsetX;
  }

  if (curTop + menuHeight > clientHeight && top - menuHeight >= 0) {
    curTop = top - menuHeight;
  }
  return { left: curLeft, top: curTop };
}

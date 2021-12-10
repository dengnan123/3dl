import React, { useState, Fragment, useEffect } from 'react';
import classnames from 'classnames';
// import styles from './index.less';

const hasMulId = (mulArr = [], id) => {
  const arr = mulArr.map(v => v.id).filter(v => v === id);
  if (arr.length) {
    return true;
  }
  return false;
};

export default ({
  list = [],
  renderTitleLeft,
  renderTitleRight,
  renderContent,
  clickStyle,
  hoverStyle,
  normalStyle,
  propsClickId,
  propsClickIdList,
}) => {
  const [nowHover, setHover] = useState({});
  const [hoverIndex, setIndex] = useState(null);
  const [nowClick, setClick] = useState({});
  const [clickIndex, setClickIndex] = useState({});
  useEffect(() => {
    if (propsClickId) {
      setClick({});
    }
  }, [propsClickId]);
  const onMouseEnter = (v, index) => {
    setHover(v);
    setIndex(index);
  };

  const onMouseLeave = () => {
    setHover({});
    setIndex(null);
  };
  const nowClickId = nowClick.id || nowClick;
  const nowHoverId = nowHover.id || nowHover;

  return (
    <Fragment>
      {list.map((v, index) => {
        const id = v.id || v;
        return (
          <div
            className={classnames(
              id === nowClickId ? clickStyle : normalStyle || {},
              id === nowHoverId ? hoverStyle : normalStyle || {},
              id === propsClickId ? clickStyle : normalStyle || {},
              hasMulId(propsClickIdList, id) ? clickStyle : normalStyle || {},
            )}
            onMouseEnter={() => {
              onMouseEnter(v, index);
            }}
            onMouseLeave={onMouseLeave}
            onClick={e => {
              e.stopPropagation();
              setClick(v);
              setClickIndex(index);
            }}
            key={id}
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
        );
      })}
    </Fragment>
  );
};

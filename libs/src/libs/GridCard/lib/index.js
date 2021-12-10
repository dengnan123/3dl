import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Icon, Tooltip, Popover, List } from 'antd';

import styles from './index.less';

function GridCard(props) {
  const {
    child: childComps = [],
    onChange,
    style: {
      cardBgColor = '#ffffff',
      borderRadius = 0,
      cardBorderColor = '#f0f1f5',
      cardNoBorder = [],
      showBoxShadow = true,
      hShadow = 1,
      vShadow = 1,
      blur = 10,
      spread = 0,
      shadowColor = '#d9dcdf',

      showTitle = true,
      title = '我是标题',
      headHeight = 45,
      headBgcolor = '#ffffff',
      headPadding = 30,
      headFontSize = 16,
      headFontWeight = 400,
      headFontColor = '#606060',
      headBorderWidth = 1,
      headBorderStyle = 'solid',
      headBorderColor = '#f0f1f5',
      titleTextAlign = 'left',

      showMore = false,
      moreBtnRight = 15,
      moreBtnWidth = 20,
      moreBtnHeight = 20,
      moreBtnRadius = 4,
      moreBtnBorderWidth = 1,
      moreBtnBorderColor = '#f0f1f5',
      moreBtnBgColor = '#f3f3fb',
      popoverPosition = 'bottom',
      popoverContentList = [],
      contentPaddingLeft = 0,
      contentPaddingTop = 0,
      contentPaddingRight = 0,
      contentPaddingBottom = 0,

      showHover = false,
      hBgColor = '#ffffff',
      hBorderColor = '#f0f1f5',
      showHShadow = false,
      hXShadow = 1,
      hYShadow = 1,
      hBlur = 10,
      hSpread = 0,
      hShadowColor = '#d9dcdf',

      showIcon = false,
      iconSize = 14,
      titleTip = 'hdjakshkd',
      iconLeft = 5,
      iconColor = '#4A90E2',
    },
  } = props;

  const [hoverStyles, setHoverStyle] = useState({});
  /**** Card Hover 事件====START ****/
  const onCardHover = useCallback(() => {
    if (!showHover) return;
    const hStyle = {
      backgroundColor: hBgColor,
      borderColor: hBorderColor,
      boxShadow: showHShadow
        ? `${hXShadow}px ${hYShadow}px ${hBlur}px ${hSpread}px ${hShadowColor}`
        : null,
    };
    setHoverStyle(hStyle);
  }, [
    showHover,
    hBgColor,
    hBorderColor,
    showHShadow,
    hXShadow,
    hYShadow,
    hBlur,
    hSpread,
    hShadowColor,
  ]);

  const onCardLeave = useCallback(() => {
    setHoverStyle({});
  }, []);
  /**** Card Hover 事件====END ****/

  /**** 更多配置====START ****/
  const onItemClick = useCallback(
    item => {
      const { compKey, compValue } = item;
      onChange && onChange({ [compKey]: compValue });
    },
    [onChange],
  );
  const RenderExtraPopoverContent = useMemo(() => {
    if (!popoverContentList || !popoverContentList.length) {
      return null;
    }
    const itemList = popoverContentList.filter(i => !!i.label);
    return (
      <List className={styles.list}>
        {itemList.map((item, index) => (
          <List.Item key={index} onClick={() => onItemClick(item)}>
            {item.label}
          </List.Item>
        ))}
      </List>
    );
  }, [popoverContentList, onItemClick]);

  const RenderExtraContent = useMemo(() => {
    if (!showMore) {
      return null;
    }
    return (
      <Popover
        placement={popoverPosition}
        title=""
        content={RenderExtraPopoverContent}
        trigger="click"
      >
        <div
          className={styles.extra}
          style={{
            width: moreBtnWidth,
            height: moreBtnHeight,
            backgroundColor: moreBtnBgColor,
            fontSize: `${moreBtnHeight - 4}px`,
            border: `solid ${moreBtnBorderWidth}px ${moreBtnBorderColor}`,
            borderRadius: moreBtnRadius,
          }}
        >
          <Icon type="ellipsis" />
        </div>
      </Popover>
    );
  }, [
    showMore,
    popoverPosition,
    moreBtnWidth,
    moreBtnHeight,
    moreBtnBgColor,
    moreBtnBorderWidth,
    moreBtnBorderColor,
    moreBtnRadius,
    RenderExtraPopoverContent,
  ]);
  /**** 更多配置====END ****/

  // Content内组件渲染
  const renderContent = useCallback(() => {
    if (!childComps || !childComps.length) {
      return <div style={{ textAlign: 'center' }}>这里为子组件集合！</div>;
    }
    return childComps.map(v => {
      const { renderChildComp } = v;
      return renderChildComp;
    });
  }, [childComps]);

  // 标题部分高度---为了计算content的高度
  const headerFinalHeight = showTitle ? headHeight : 0;

  let cardBorderStyle = { borderWidth: 1, borderStyle: 'solid', borderColor: cardBorderColor };
  const isHasNoneBorder = cardNoBorder.length === 4;
  const isHasBorder = cardNoBorder.length !== 0;
  if (isHasNoneBorder) {
    cardBorderStyle.borderWidth = '0px';
  } else if (isHasBorder) {
    for (let i of cardNoBorder) {
      const borderName = `border${i}Width`;
      cardBorderStyle[borderName] = '0px';
    }
  }
  return (
    <div
      className={styles.container}
      style={{
        boxShadow: showBoxShadow
          ? `${hShadow}px ${vShadow}px ${blur}px ${spread}px ${shadowColor}`
          : null,
        borderRadius: borderRadius,
        // borderWidth: 1,
        // borderStyle: 'solid',
        // borderColor: cardBorderColor,
        ...cardBorderStyle,
        backgroundColor: cardBgColor,
        ...hoverStyles,
      }}
      onMouseEnter={onCardHover}
      onMouseLeave={onCardLeave}
    >
      {/* 标题部分 */}
      {showTitle && (
        <div
          className={styles.headerPart}
          style={{
            height: headHeight,
            lineHeight: `${headHeight}px`,
            backgroundColor: headBgcolor,
            borderBottomWidth: headBorderWidth,
            borderBottomStyle: headBorderStyle,
            borderBottomColor: headBorderColor,
          }}
        >
          <h1
            style={{
              height: headHeight,
              lineHeight: `${headHeight}px`,
              fontSize: `${headFontSize}px`,
              fontWeight: headFontWeight,
              color: headFontColor,
              textAlign: titleTextAlign,
              padding: `0 ${headPadding}px`,
            }}
          >
            {title}
            {showIcon && (
              <Tooltip title={titleTip}>
                <Icon
                  type="exclamation-circle"
                  theme="twoTone"
                  twoToneColor={iconColor}
                  style={{
                    marginLeft: iconLeft,
                    fontSize: iconSize,
                  }}
                />
              </Tooltip>
            )}
          </h1>
          {/* 更多部分 */}
          {showMore && (
            <div
              className={styles.moreDiv}
              style={{
                right: moreBtnRight,
              }}
            >
              {RenderExtraContent}
            </div>
          )}
        </div>
      )}
      {/* 内容部分，渲染子组件 */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: `calc(100% - ${headerFinalHeight}px)`,
          paddingLeft: contentPaddingLeft,
          paddingTop: contentPaddingTop,
          paddingRight: contentPaddingRight,
          paddingBottom: contentPaddingBottom,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
          }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

GridCard.propTypes = {
  style: PropTypes.object,
};

export default GridCard;

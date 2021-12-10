import React, { useState, useCallback, useEffect, useRef } from 'react';
import classnames from 'classnames';
import { Tabs } from 'antd';
import { omit } from 'lodash';
import { getNameByLang } from '../../../helpers/lang';
import { useMinNoActionDoSome } from '../../../hooks/util';
import RenderSvg from '../../../components/RenderSvg';

import styles from './index.less';

const { TabPane } = Tabs;

export const getBasicStyle = style => {
  const newSty = omit(style, 'left', 'top', 'height', 'width');
  return newSty;
};

const CustomizeTabs = props => {
  const { child: childComps = [], style, lang = 'en-US', otherCompParams, onChange } = props;
  const {
    type,
    tabBorderColor,
    tabBorderWidth = 1,
    tabAlign = 'left',
    tabPaddingLeft = 0,
    tabPaddingRight = 0,
    activeBarBgColor,
    activeBarHeight = 2,
    activeBarBorder = 0,
    barPadding = '10px 16px',
    contentAlign = 'center',
    contentPadding = '0px',
    contentBorderRadius = '0px',
    barWidth,
    barHeight,
    tabFontSize = 14,
    tabFontColor,
    tabFontHighlightColor,
    tabBgColor,
    tabBgHighlightColor,
    tabBarGutter,
    tabPosition,
    animated,
    size,
    showIcon,
    iconSize = 12,
    iconMarginRight = 5,
    tabList = [],
    isRetunToFirst = false,
    displayMargin,
    delayTime = 60,
    defaultTabKey = '0',
  } = style;

  const Activty = useRef('0');

  let renderData = [];
  if (!childComps || childComps.length === 0) {
    renderData = [];
  } else {
    renderData = (childComps || []).sort((a, b) => {
      return a.basicStyle.sortIndex - b.basicStyle.sortIndex;
    });
  }

  const totalPage = tabList.length;

  const [activeKey, setActiveKey] = useState('0');

  useEffect(() => {
    const { fetchData } = otherCompParams || {};
    const { tabActiveKey } = fetchData || {};

    if (tabActiveKey) {
      Activty.current = tabActiveKey;
      setActiveKey(tabActiveKey);
    }
  }, [otherCompParams]);

  const _onChange = useCallback(
    key => {
      const current = tabList[Number(key)];
      const compKey = current.compKey;
      const compValue = current.compValue;
      Activty.current = key;
      setActiveKey(() => key);
      onChange && onChange({ [compKey]: compValue });
    },
    [tabList, setActiveKey, onChange],
  );

  useEffect(() => {
    const tabWrapperNode = document.getElementById('tabWrapper');
    const tabsList = tabWrapperNode.getElementsByClassName('ant-tabs-tab');
    if (!tabsList || !tabsList.length) return;

    for (let i in tabsList) {
      const item = tabsList[i];
      if (!item || !item.style) return;
      if (barPadding) {
        item.style.padding = barPadding;
      }
    }
    return () => {
      Activty.current = null;
    };
  }, [barPadding, barWidth, barHeight]);

  useEffect(() => {
    const tabWrapperNode = document.getElementById('tabWrapper');
    const activeBar = tabWrapperNode.getElementsByClassName('ant-tabs-ink-bar-animated')[0];
    if (!activeBar) return;
    activeBar.style.backgroundColor = activeBarBgColor;
    activeBar.style.borderRadius = activeBarBorder + 'px';
    // 直接设置style.height 会失败，该class上有动画，会把设置的高度移除，高度默认为2
    activeBar.style.borderTop = `${activeBarHeight}px solid ${activeBarBgColor}`;
  }, [activeBarBgColor, activeBarHeight, activeBarBorder]);

  const resetActivty = () => {
    if (Number(Activty.current) !== Number(defaultTabKey) && isRetunToFirst) {
      console.log('defaultTabKey change', defaultTabKey);
      Activty.current = defaultTabKey;
      setActiveKey(() => defaultTabKey);
    }
  };
  useMinNoActionDoSome({
    autoCloseTime: delayTime || 60,
    callback: resetActivty,
    eventName: ['touchstart', 'keyup', 'click'],
  });

  const tabGlobalProps = {
    defaultActiveKey: '0',
    activeKey,
    type,
    tabBarGutter,
    tabPosition,
    animated,
    size: type !== 'card' ? size : 'default',
    onChange: _onChange,
  };

  return (
    <div
      id="tabWrapper"
      className={classnames(styles.tabs, {
        [styles.flexRow]: ['left', 'right'].includes(tabPosition),
        [styles.noneTab]: type === 'none',
      })}
    >
      {!!totalPage && (
        <Tabs
          {...tabGlobalProps}
          tabBarStyle={{
            borderColor: tabBorderColor,
            borderWidth: tabBorderWidth,
            textAlign: tabAlign,
            paddingLeft: tabPaddingLeft,
            paddingRight: tabPaddingRight,
          }}
        >
          {tabList.map((n, index) => {
            const v = renderData[index] ? renderData[index] : {};
            const { renderChildComp } = v;
            const isActive = Number(activeKey) === index;
            const tabProps = {
              style: {
                color: isActive ? tabFontHighlightColor : tabFontColor,
                fontSize: tabFontSize,
                width: barWidth,
                height: barHeight,
                padding: contentPadding,
                lineHeight: `${barHeight}px`,
                textAlign: contentAlign,
                backgroundColor: isActive ? tabBgHighlightColor : tabBgColor,
                borderRadius: contentBorderRadius,
              },
            };

            let tab = <div {...tabProps}>{`${getNameByLang(lang, n.label, n.labelEn)}`}</div>;

            if (showIcon) {
              tab = (
                <div className={styles.tap} {...tabProps}>
                  <RenderSvg
                    style={{ width: iconSize, height: iconSize, marginRight: iconMarginRight }}
                    svgStr={n.svgStr}
                  />
                  {`${getNameByLang(lang, n.label, n.labelEn)}`}
                </div>
              );
            }

            let renderChild = `${index}--关联内容`;
            if (renderChildComp) {
              renderChild = renderChildComp;
            }

            return (
              <TabPane tab={tab} key={`${index}`}>
                <div
                  style={{
                    position: 'relative',
                    // width: displayWidth || '100%',
                    height: '100%',
                    margin: displayMargin ? `${displayMargin}` : '0px',
                  }}
                >
                  {renderChild}
                </div>
              </TabPane>
            );
          })}
        </Tabs>
      )}
    </div>
  );
};

export default CustomizeTabs;

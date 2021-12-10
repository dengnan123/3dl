import { useCallback, useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDeepCompareEffect } from 'react-use';
import { isNullOrUndefined } from '../../../helpers/utils';
import { Breadcrumb } from 'antd';
import HomeIcon from '../../../assets/home.png';
import styles from './index.less';

const AntdBreadcrumb = props => {
  const {
    style: {
      compKey = 'antdBreadcrumb',
      separator = '/',
      lineHeight = 22,
      fontSize = 14,
      fontColor = 'rgba(0,0,0,0.45)',
      lastFontColor = 'rgba(0,0,0,0.65)',
      iconBasic = { width: 16, height: 16, marginRight: 5, showFirst: true },
      breadcrumb = { marginRight: 20 },
    },
    otherCompParams = {},
    onChange,
    data,
  } = props;

  /**
   * 用于控制面包屑的数量,可能会有多个面包屑
   */
  const dataSource = data?.dataSource || [];

  /**
   * @typedef dataItem
   * @property {string} key 唯一
   * @property {object} style 包裹每个面包屑span的行内样式
   * @property {listItem[]} list 每个面包屑中的列表
   * @typedef listItem
   * @property {object} icon
   * @property {string} icon.src 图标链接
   * @property {boolean} icon.hidden 是否隐藏，默认false
   * @property {object} label
   * @property {string} label.text 文字内容
   * @property {boolean} label.hidden 是否隐藏，默认false
   * @property {object} label.style 文字的行内样式
   */
  /**
   * 递归
   * @type {dataItem}
   */
  const dataSourceItem = otherCompParams?.dataSourceItem;

  const [{ keyList, dataSourceByKey }, setState] = useState({
    keyList: [],
    dataSourceByKey: {},
  });

  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useDeepCompareEffect(() => {
    const keyList = [];
    const dataSourceByKey = {};
    dataSource.forEach(n => {
      // 如果key不存在或者list数组为空就不做处理
      if (isNullOrUndefined(n?.key) || keyList.includes(n?.key) || !n?.list?.length) {
        return;
      }
      keyList.push(n.key);
      dataSourceByKey[n.key] = n;
    });
    setState({ keyList, dataSourceByKey });
  }, [dataSource]);

  useDeepCompareEffect(() => {
    const currentKey = dataSourceItem?.key;
    const itemList = dataSourceItem?.list || [];
    // 没有dataSourceItem或者没有传key或者itemList长度为0就不作处理
    if (!dataSourceItem || isNullOrUndefined(currentKey) || !itemList?.length) return;
    setState(state => {
      let newKeyList = [...state.keyList];
      let newDataSourceByKey = { ...state.dataSourceByKey };
      // 如果key已经存在，就往list里插入数据
      if (newDataSourceByKey[currentKey]) {
        newDataSourceByKey[currentKey].list.push(...itemList);
      } else {
        newKeyList.push(currentKey);
        newDataSourceByKey[currentKey] = dataSourceItem;
      }

      return { keyList: newKeyList, dataSourceByKey: newDataSourceByKey };
    });
  }, [dataSourceItem]);

  const handleClick = useCallback(
    ({ keyItem, listItem, isLast, index, key }) => {
      if (isLast) {
        return;
      }
      let newKeyList = [...keyList];
      let newDataSourceByKey = { ...dataSourceByKey };
      const currentList = [...(newDataSourceByKey?.[key]?.list || [])];
      newDataSourceByKey[key].list = currentList.filter((n, i) => i <= index);
      setState({ keyList: newKeyList, dataSourceByKey: newDataSourceByKey });
      const params = { [compKey]: { key, keyItem, listItem } };
      onChangeRef.current && onChangeRef.current(params);
    },
    [dataSourceByKey, keyList, compKey],
  );

  const renderIcon = useCallback(
    (icon, isFirst, isLast) => {
      const { width, height, showFirst = true, marginRight } = iconBasic || {};
      const { src = HomeIcon, hidden, style } = icon || {};
      let hiddenIcon = hidden;
      if (showFirst) {
        hiddenIcon = !isFirst;
      }
      return (
        !hiddenIcon && (
          <i
            className={styles.icon}
            style={{
              width,
              height,
              marginRight,
              backgroundImage: `url(${src})`,
              ...style,
            }}
          />
        )
      );
    },
    [iconBasic],
  );

  const renderLabel = useCallback(
    (label, isLast) => {
      const { hidden, text, style } = label || {};
      const color = isLast ? lastFontColor : fontColor;
      return !hidden && <span style={{ color, fontSize, ...style }}>{text}</span>;
    },
    [fontColor, lastFontColor, fontSize],
  );

  let basicPaddingLeft = 0;
  if (!isNaN(iconBasic?.width)) {
    basicPaddingLeft += iconBasic?.width;
  }
  if (!isNaN(iconBasic?.marginRight)) {
    basicPaddingLeft += iconBasic?.marginRight;
  }

  return (
    <div className={styles.container} style={{ lineHeight: `${lineHeight}px` }}>
      {keyList?.map(key => {
        const keyItem = dataSourceByKey?.[key];
        const list = keyItem?.list || [];
        return (
          <span
            key={key}
            style={{
              lineHeight: `${lineHeight}px`,
              marginRight: breadcrumb?.marginRight,
              ...keyItem?.style,
            }}
          >
            <Breadcrumb separator={separator}>
              {list?.map((n, index) => {
                const isFirst = index === 0;
                const isLast = index === list.length - 1;
                let hiddenIcon = n?.icon?.hidden;
                if (iconBasic?.showFirst) {
                  hiddenIcon = !isFirst;
                }
                const paddingLeft = hiddenIcon ? 0 : basicPaddingLeft;

                return (
                  <Breadcrumb.Item
                    key={index}
                    style={{ paddingLeft }}
                    onClick={() => handleClick({ keyItem, listItem: n, isLast, index, key })}
                  >
                    {renderIcon(n?.icon, isFirst, isLast)}
                    {renderLabel(n?.label, isLast)}
                  </Breadcrumb.Item>
                );
              })}
            </Breadcrumb>
          </span>
        );
      })}
    </div>
  );
};

AntdBreadcrumb.propTypes = {
  onChange: PropTypes.func,
  style: PropTypes.object,
  lang: PropTypes.string,
  data: PropTypes.object,
  shouldClearParams: PropTypes.any,
  otherCompParams: PropTypes.object,
  isHidden: PropTypes.bool,
  loading: PropTypes.bool,
};

export default AntdBreadcrumb;

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Checkbox } from 'antd';
import { omit } from 'lodash';
import classnames from 'classnames';

import { ALL_MENUS_TREE } from '../../../../../helpers/menu';

import styles from './index.less';

const renderOptions = children => {
  const options = children.map(i => {
    return {
      label: i.name,
      value: i.key,
    };
  });
  return options;
};

// 对Menu数据处理
const queryChildrensId = children => {
  let childrenIds = {};
  const newChildren = children.map(child => {
    const { key, feature } = child;
    // childrenIds.push(key);
    childrenIds[key] = 1;
    if (feature) {
      return {
        ...child,
        featIds: feature.map(c => c.key),
      };
    }
    return child;
  });

  return { childrenIds, newChildren };
};

const setAllMenus = () => {
  const menus = ALL_MENUS_TREE.map(m => {
    const { children } = m;
    if (children) {
      const { childrenIds, newChildren } = queryChildrensId(children);
      return {
        ...m,
        childrenIds,
        children: newChildren,
      };
    }
    return m;
  });
  return menus;
};

function FeatPermission(props) {
  const { featureData, setFeatChecked } = props;
  const [MENU_LIST, setMenus] = useState([]);

  useEffect(() => {
    const list = setAllMenus();
    setMenus(list);
  }, []);

  /**
   * 一级Menu全选
   * 选中：赋值1(以下值 1 的key都表示全选，并且以后添加menu或功能都会被选中)
   * 取消选中：从接口数据里删除
   */
  const onClickAll = useCallback(
    (event, key) => {
      let newFeature = { ...featureData };
      if (event.target.checked) {
        newFeature[key] = 1;
      } else {
        delete newFeature[key];
      }
      setFeatChecked(newFeature);
    },
    [featureData, setFeatChecked],
  );

  /**
   * 二级Menu点击
   * 选中：赋值1
   * 取消选中：若一级menu当前值为1，则将该一级menu的子menu除当前key以外的值都赋值1，即 [parentKey]: { [key1]:1, [key2]:1 };
   * -------- 若不为1，则删除该key的值
   */
  const onPageClick = useCallback(
    (event, key, parentKey, childrenIds) => {
      let newFeature = { ...featureData };
      let parentValues = newFeature[parentKey] || {};
      if (event.target.checked) {
        newFeature[parentKey] = { ...parentValues, [key]: 1 };
        return setFeatChecked(newFeature);
      }
      // 取消选中
      if (parentValues === 1) {
        const childrenChecked = omit(childrenIds, [key]);
        parentValues = childrenChecked;
      } else {
        delete parentValues[key];
      }
      // 该一级menu的值为 {},则从数据里删除该一级menu，不提交给后端
      if (JSON.stringify(parentValues) === '{}') {
        delete newFeature[parentKey];
      } else {
        newFeature[parentKey] = parentValues;
      }
      setFeatChecked(newFeature);
    },
    [featureData, setFeatChecked],
  );

  /**
   * 功能项点击
   */
  const onFeatClick = useCallback(
    (checkedList, key, parentKey, childrenIds, featIds) => {
      let newFeature = { ...featureData };
      let parentValues = newFeature[parentKey] || {};
      if (parentValues === 1) {
        let childrenChecked = { ...childrenIds };
        childrenChecked[key] = checkedList;
        newFeature[parentKey] = childrenChecked;
      } else if (checkedList.length === featIds.length) {
        newFeature[parentKey] = { ...parentValues, [key]: 1 };
      } else {
        newFeature[parentKey] = { ...parentValues, [key]: checkedList };
      }
      setFeatChecked(newFeature);
    },
    [featureData, setFeatChecked],
  );

  const renderChildren = useCallback(
    ({ children, parentKey, childrenIds, isDisabled }) => {
      if (!children) return null;
      const parantHash = featureData[parentKey] || {};
      const isParentChecked = parantHash === 1;
      return children.map(param => {
        const { key, name, feature = [], featIds } = param;
        const tagChecked = parantHash[key];
        const isPageChecked = !!tagChecked;
        const hasFeatures = feature.length !== 0;

        let checkedTags = [];
        if (isParentChecked || tagChecked === 1) {
          checkedTags = featIds;
        }
        if (tagChecked && tagChecked !== 1) {
          checkedTags = tagChecked;
        }
        return (
          <Row key={key} className={styles.rowItem}>
            <Col span={6}>
              <Checkbox
                checked={isParentChecked || isPageChecked}
                className={styles.checkedAll}
                onChange={e => onPageClick(e, key, parentKey, childrenIds)}
                disabled={isDisabled}
              >
                {name}
              </Checkbox>
            </Col>
            {hasFeatures && (
              <Col span={18}>
                <Row>
                  <Checkbox.Group
                    disabled={isDisabled}
                    options={renderOptions(feature)}
                    value={checkedTags}
                    onChange={checkedList =>
                      onFeatClick(checkedList, key, parentKey, childrenIds, featIds)
                    }
                  />
                </Row>
              </Col>
            )}
          </Row>
        );
      });
    },
    [featureData, onPageClick, onFeatClick],
  );

  const RenderFeature = useMemo(() => {
    const menusContent = MENU_LIST.map(m => {
      const { key, name, children, childrenIds, isAdminPerm, isAllPerm } = m;
      const isAllChecked = !!featureData[key];
      const isDisabled = isAdminPerm || isAllPerm;
      const isChecked = isAllPerm;
      return (
        <div className={styles.modules} key={key}>
          <h3>
            <Checkbox
              onChange={e => onClickAll(e, key)}
              checked={isAllChecked || isChecked}
              disabled={isDisabled}
            >
              {name}
            </Checkbox>
          </h3>
          {renderChildren({ children, parentKey: key, childrenIds, isDisabled })}
        </div>
      );
    });
    return menusContent;
  }, [MENU_LIST, featureData, onClickAll]);

  return <div className={classnames(styles.permContent, styles.featPerm)}>{RenderFeature}</div>;
}

FeatPermission.propTypes = {
  featureData: PropTypes.object,
  setFeatChecked: PropTypes.func,
};

export default FeatPermission;

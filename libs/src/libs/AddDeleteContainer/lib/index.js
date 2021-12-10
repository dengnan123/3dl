import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';
import { v4 } from 'uuid';
import { useDeepCompareEffect } from 'react-use';
import { getBtnFunc } from './utils';
// import { debounce } from 'lodash';
// import moment from 'dayjs';
// const renderChildCompFunc = () => <p>1122</p>;
function Index(props) {
  const { child = [], style = {}, lang = 'zh-CN', onChange, data = {} } = props;
  const {
    DEFAULT_COUNT = 1,
    MAX_COUNT = 5,
    fontSize = 12,
    // addfontColor = '#000000',
    // deleteFontColor = '#000000',
    borderRadius = 0,
    marginLeft = 30,
    marginLeftBtn = 5,
    widthBtn = 60,
    heightBtn = 30,
  } = style;
  console.log('AddDeleteContainer datadatadata',data)
  const { childrenFromData = [] } = data || {};

  const btnStyle = useMemo(
    () => ({
      ...style,
      fontSize: `${fontSize}px`,
      width: `${widthBtn}px`,
      height: `${heightBtn}px`,
      marginLeft: `${marginLeftBtn}px`,
      borderRadius: `${borderRadius}px`,
    }),
    [borderRadius, fontSize, heightBtn, marginLeftBtn, style, widthBtn],
  );

  const onChangeRef = useRef(onChange);
  const childRef = useRef();
  childRef.current = child;
  const childLength = childRef.current?.length || 0;
  const defaultChildData = (i, data = {}) => ({
    childId: i,
    childComp: childRef.current[0],
    childData: data,
  });

  const [childComps, setChildComps] = useState([]);

  useDeepCompareEffect(() => {
    /******子组件RenderData******/
    let renderData = [];
    if (childLength === 0 && !childrenFromData.length) {
      renderData = [];
    }
    if (childLength !== 0 && !childrenFromData.length) {
      const initNum = DEFAULT_COUNT > MAX_COUNT ? MAX_COUNT : DEFAULT_COUNT;
      renderData = new Array(initNum).fill(1).map((v, i) => {
        return defaultChildData(v4());
      });
    }
    if (childrenFromData.length) {
      renderData = childrenFromData.map((child, i) => {
        return defaultChildData(v4(), child);
      });
    }
    console.log(renderData, 'renderData--0701');

    setChildComps(renderData);
  }, [DEFAULT_COUNT, childLength, MAX_COUNT, childrenFromData]);

  const updateState = useCallback(
    payload =>
      setChildComps(state => {
        const { data, id } = payload;
        return state.map(v => {
          if (v.childId === id) {
            v.childData = data;
          }
          return v;
        });
      }),
    [],
  );

  const { addBtn, deleteBtn } = getBtnFunc({
    childComps,
    updateState,
    defaultChildData,
    setChildComps,
    style: { ...btnStyle, lang },
  });

  const renderBtn = useCallback(
    ({ i, id }) => {
      const totalLength = childComps.length;
      return (
        <div key={id}>
          {i === 0 && totalLength === 1 ? addBtn(id) : deleteBtn(id)}
          {i === totalLength - 1 && totalLength !== 1 && addBtn(id)}
        </div>
      );
    },
    [addBtn, childComps.length, deleteBtn],
  );

  const render = useCallback(
    _ => {
      // const handleChildChange = (id, data) => {
      //   updateState({ id, data });
      // };

      const renderItem = ({ childComp, childData, childId, i }) => {
        const { width, height, renderChildCompFunc } = childComp;
        if (childComp && renderChildCompFunc) {
          return (
            <div className={styles.childItem}>
              <div style={{ width, height }}>
                {renderChildCompFunc &&
                  renderChildCompFunc(childData, {
                    testClick() {
                      console.log('123123123');
                    },
                  })}
              </div>
              <div style={{ marginLeft: `${marginLeft}px` }}>{renderBtn({ i, id: childId })}</div>
            </div>
          );
        }
      };

      return childComps.map((v, i) => {
        const { childComp = {}, childId, childData } = v;
        return <li key={childId}>{renderItem({ childComp, childData, childId, i })}</li>;
      });
    },
    [childComps, marginLeft, renderBtn],
  );

  useEffect(() => {
    console.log('AddDeleteContainer:', childComps);
    onChangeRef.current &&
      onChangeRef.current({
        childDataArr: childComps,
      });
  }, [childComps]);

  if (!childComps || !childComps.length) {
    return <div>请放入子组件</div>;
  }
  return (
    <div>
      <ul className={styles.wrapper}>{render()}</ul>
    </div>
  );
}

Index.propTypes = {
  style: PropTypes.object,
  data: PropTypes.object,
  otherCompParams: PropTypes.object,
};

export default Index;

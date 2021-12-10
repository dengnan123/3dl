import React, { useState, useEffect, lazy, Suspense, useMemo, useCallback } from 'react';
import querystring from 'query-string';
import { Card, Tabs, InputNumber } from 'antd';
import DataConfig from '../components/DataConfig';
import ScreenMockData from '../libs/mockData';
import InputColor from '../components/InputColor';
import { useDebounceFn } from '@umijs/hooks';
import { menus } from '../components/GlobalSider/menu';
import styles from './index.less';

const { TabPane } = Tabs;

export default props => {
  const { compName = 'AutoText' } = querystring.parse(decodeURIComponent(window.location.search));
  // const contentComps = useRef(null);

  const compHash = useMemo(() => {
    const obj = {};
    const generateHash = data => {
      for (const v of data) {
        const { child, libPath, compName } = v;
        if (libPath) {
          obj[compName] = libPath;
        } else {
          obj[compName] = compName;
        }
        if (child && child.length) {
          generateHash(child);
        }
      }
    };
    generateHash(menus);
    return obj;
  }, []);

  useEffect(() => {
    const canvasSize = localStorage.getItem('canvasSize');
    if (!canvasSize) {
      localStorage.setItem('canvasSize', [700, 400]);
    }
  }, []);

  const [OtherComponent, setOtherComponent] = useState(null);
  const [ConfigComp, setConfigComp] = useState(null);
  useEffect(() => {
    const comp = lazy(() => import(`../libs/${compHash[compName]}/lib`));
    setOtherComponent(comp);
  }, [compHash, compName, setOtherComponent]);

  useEffect(() => {
    const comp = lazy(() => import(`../libs/${compHash[compName]}/config`));
    setConfigComp(comp);
  }, [compHash, compName, setConfigComp]);

  const _mockData = ScreenMockData[compName];
  const showDataConfig = true;

  const [style, updateStyle] = useState({});

  const getDefaultCavansSize = useCallback(() => {
    const canvasSize = localStorage.getItem('canvasSize');
    let width = 700;
    let height = 400;
    if (!canvasSize) {
      localStorage.setItem('canvasSize', [700, 400]);
    } else {
      const [storageWidth, storageHeight] = canvasSize.split(',');
      width = parseInt(storageWidth);
      height = parseInt(storageHeight);
    }
    return { divWidth: width, divHeight: height };
  }, []);

  const [{ divWidth, divHeight, bgc }, setDiv] = useState(_ => {
    const divSize = getDefaultCavansSize();
    return {
      ...divSize,
      bgc: { r: 255, g: 255, b: 255, a: 1 },
    };
  });

  const { run } = useDebounceFn((v, type) => {
    change(v, type);
  }, 300);

  const initData = _mockData ? _mockData : {};

  const [{ mockData }, updateMockData] = useState({
    mockData: initData,
  });

  useEffect(() => {
    const initData = _mockData ? _mockData : {};
    updateMockData({
      mockData: initData,
    });
    updateStyle({});

    const divSize = getDefaultCavansSize();
    setDiv({
      // divWidth: contentComps.current.offsetWidth || 700,
      // divHeight: contentComps.current.offsetHeight || 700,
      ...divSize,
      bgc: { r: 255, g: 255, b: 255, a: 1 },
    });
  }, [compName, updateMockData, updateStyle, setDiv, _mockData, getDefaultCavansSize]);

  const { run: updateStyleDeb } = useDebounceFn(data => {
    updateStyle(data);
  }, 300);

  const configProps = {
    updateStyle: updateStyleDeb,
    style,
    compName,
    mockData,
  };

  // antd  modal挂载容器
  const getContainer = () => {
    return document.getElementById('containerDiv') || document.body;
  };
  const compProps = {
    width: divWidth,
    height: divHeight,
    style,
    data: mockData,
    getContainer,
  };

  const dataProps = {
    mockData,
    updateMockData,
    compName,
  };

  const change = (v, type) => {
    let [divWidth, divHeight] = localStorage.getItem('canvasSize').split(',');
    if (type === 'divWidth') divWidth = v;
    if (type === 'divHeight') divHeight = v;
    localStorage.setItem('canvasSize', [divWidth, divHeight]);
    setDiv(pre => {
      return {
        ...pre,
        [type]: v,
      };
    });
  };

  const title = () => {
    return (
      <div className={styles.title}>
        <span>
          组件宽度：
          <InputNumber
            value={divWidth}
            onChange={v => {
              run(v, 'divWidth');
            }}
          />
        </span>
        <span>
          组件高度：
          <InputNumber
            value={divHeight}
            onChange={v => {
              run(v, 'divHeight');
            }}
          />
        </span>

        <span className={styles.backgroundColor}>
          <span>画布背景色：</span>
          <InputColor
            value={bgc}
            onChange={v => {
              run(v, 'bgc');
            }}
          ></InputColor>
        </span>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.contentComps}
        // ref={contentComps}
      >
        {/* <Layout>
          <Layout.Header style={{ background: '#FFF' }}>{title()}</Layout.Header>
          <Layout.Content style={{ overflow: 'auto', background: '#FFF' }}>
            <div
              id="containerDiv"
              style={{
                width: divWidth,
                height: divHeight,
                background: bgc,
                border: '1px solid #d0c9c9',
                margin: 'auto',
                overflow: 'auto',
              }}
            >
              {OtherComponent && (
                <Suspense fallback={<div>Loading...</div>}>
                  <OtherComponent {...compProps} />
                </Suspense>
              )}
            </div>
          </Layout.Content>
        </Layout> */}

        <Card title={title()} className={styles.Card}>
          <div
            style={{
              width: divWidth,
              height: divHeight,
              background: bgc,
            }}
            id="containerDiv"
          >
            {OtherComponent && (
              <Suspense fallback={<div>Loading...</div>}>
                <OtherComponent {...compProps} />
              </Suspense>
            )}
          </div>
        </Card>
      </div>

      <div className={styles.right}>
        <Card title="组件配置" style={{ width: 300 }}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="属性" key="1">
              {ConfigComp && (
                <Suspense fallback={<div>Loading...</div>}>
                  <ConfigComp {...configProps}></ConfigComp>
                </Suspense>
              )}
            </TabPane>
            {showDataConfig && (
              <TabPane tab="数据" key="2">
                <DataConfig {...dataProps}></DataConfig>
              </TabPane>
            )}
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

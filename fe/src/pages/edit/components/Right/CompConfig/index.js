import React, { useState, useEffect } from 'react';
import { useDebounce } from 'react-use';
import { connect } from 'dva';
// import { debounce } from 'lodash';
// import PropTypes from 'prop-types';
// import { Tabs } from 'antd';

// import { updateTreeArrByKey } from '@/helpers/arrayUtil';
// import { getCompConfig } from '@/helpers/screen';
import { API_HOST } from '@/config';
import { getAllDataSource } from '@/service';
import { useDoApi } from '@/hooks/apiHost';
import { getParseSearch, getMockData } from '@/helpers/utils';

import CompDataConfig from './components/CompDataConfig';
import BasicConfig from './components/BasicConfig';
import InteractiveConfig from './components/InteractiveConfig';
import CompStyleConfig from './components/CompStyleConfig';
import Auth from './components/Auth';

import styles from './index.less';

const Right = props => {
  const {
    isSelectCompInfo,
    setUseCompList,
    initUseCompList,
    addDataUseCompList,
    pageConfig,
    attributeUpdate,
    saveDataDeps,
    saveContainerDeps,
    updateDataById,
    containerDivClick,
  } = props;

  const [updateValue, setUpdateValue] = useState(null);
  const [tabKey, setKey] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const { pageId, tagId } = getParseSearch();
  const { state, doApi } = useDoApi(getAllDataSource, true, { pageId, tagId });
  const dataSourceList = state?.value?.data || [];

  useDebounce(
    () => {
      if (!updateValue) {
        return;
      }
      updateStyle(updateValue);
    },
    500,
    [updateValue],
  );

  const { id, style = {}, compName, mockData } = isSelectCompInfo;

  useEffect(() => {
    if (!id) {
      setKey(null);
      setDrawerVisible(false);
    } else {
      setKey('1');
      setActiveIndex(0);
      setDrawerVisible(true);
    }
  }, [id]);

  const formItemLayout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  const onTabsChange = (key, currentIndex) => {
    // TODO: 返回按钮
    if (key === 'return') {
      setDrawerVisible(false);
      setKey(null);
      containerDivClick();
      return;
    }
    setActiveIndex(currentIndex);
    if (tabKey === key) {
      setDrawerVisible(false);
      setKey(null);
      return;
    }
    setKey(key);
    setDrawerVisible(true);
  };

  const updateStyle = field => {
    const data = {
      style: field,
      id,
    };
    attributeUpdate({
      id,
      data,
    });
  };

  const updateMockData = field => {
    attributeUpdate({
      id,
      data: field,
    });
  };

  let staticData = {};

  const compProps = {
    pageConfig,
    updateStyle,
    formItemLayout,
    style,
    id: isSelectCompInfo.id,
    isSelectCompInfo,
    pageId,
    addDataUseCompList,
    updateMockData,
    mockData: getMockData(mockData, staticData) || {},
    compName,
    API_HOST,
    attributeUpdate,
  };

  const dataConfigProps = {
    formItemLayout,
    style,
    compName,
    mockData,
    updateMockData,
    data: isSelectCompInfo,
    staticData,
    getAllDataSourceByPageId() {
      doApi({
        pageId,
        tagId,
      });
    },
    dataSourceList,
    isSelectCompInfo,
    attributeUpdate,
  };

  const basicConfigProps = {
    setUseCompList,
    isSelectCompInfo,
    formItemLayout,
    updateDataById,
    attributeUpdate,
  };

  const interactiveConfigProps = {
    initUseCompList,
    formItemLayout,
    isSelectCompInfo,
    saveDataDeps,
    saveContainerDeps,
    dataSourceList,
  };

  const authProps = {
    data: isSelectCompInfo,
    attributeUpdate,
    isSelectCompInfo,
    dataSourceList,
  };

  const buttonsArr = [
    { value: '基础', key: '1' },
    { value: '属性', key: '2' },
    { value: '数据', key: '3' },
    { value: '交互', key: '4' },
    { value: '权限', key: '5' },
    { value: '返回', key: 'return' },
  ];

  const renderPageContent = {
    '1': <BasicConfig {...basicConfigProps}></BasicConfig>,
    '2': id && compName !== 'Group' && <CompStyleConfig {...compProps}></CompStyleConfig>,
    '3': <CompDataConfig {...dataConfigProps}></CompDataConfig>,
    '4': <InteractiveConfig {...interactiveConfigProps}></InteractiveConfig>,
    '5': <Auth {...authProps}></Auth>,
  };

  return (
    <div>
      <div className={styles.buttonsDiv}>
        {buttonsArr.map((b, index) => {
          const { value, key } = b;
          return (
            <div
              key={key}
              onClick={() => onTabsChange(key, index)}
              className={tabKey === key ? styles.isSelected : null}
            >
              {value}
            </div>
          );
        })}
        <div
          className={styles.activeLink}
          style={{ top: activeIndex * 56 + 10, opacity: drawerVisible ? 1 : 0 }}
        ></div>
      </div>
      <div className={styles.customizeDrawer} style={{ right: drawerVisible ? 63 : -400 }}>
        {drawerVisible && renderPageContent[tabKey]}
      </div>
    </div>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    attributeUpdate: data => {
      dispatch({
        type: 'edit/attributeUpdate',
        payload: data,
      });
    },
    commonUpdate: data => {
      dispatch({
        type: 'edit/commonUpdate',
        payload: data,
      });
    },
    saveDataDeps: data => {
      dispatch({
        type: 'edit/saveDataDeps',
        payload: data,
      });
    },
    saveContainerDeps: data => {
      dispatch({
        type: 'edit/saveContainerDeps',
        payload: data,
      });
    },
    getAllDataSourceByPageId: data => {
      dispatch({
        type: 'edit/getAllDataSourceByPageId',
        payload: data,
      });
    },
    updateSelectInfo: data => {
      dispatch({
        type: 'edit/updateState',
        payload: {
          isSelectCompInfo: data,
        },
      });
    },
    updateDataById: data => {
      dispatch({
        type: 'edit/updateDataById',
        payload: data,
      });
    },
  };
};

export default connect(({ edit, loading }) => {
  return {};
}, mapDispatchToProps)(Right);

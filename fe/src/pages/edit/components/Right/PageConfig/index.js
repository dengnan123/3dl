import React, { useState, useEffect } from 'react';
import { Form } from 'antd';
import { debounce } from 'lodash';

import ModalCodeEdit from '@/components/ModalCodeEdit';
// import { transformCode, addEs5CodeToData } from '@/helpers/screen';
import { getParseSearch } from '../../../../../helpers/utils';

import GridLayoutConfig from '../GridLayoutConfig';
import RulerConfig from '../RulerConfig';

import PageBaseConfig from './PageBaseConfig';
import styles from './index.less';

// const { TabPane } = Tabs;
const initPageShell = `
const onPageMount = (opts) =>{
  console.log('页面配置初始化')
}

const onPageUnMount = (opts) =>{
   console.log('页面卸载')
}

return {
  onPageMount,
  onPageUnMount
}
  `;

const PageConfig = props => {
  const {
    pageConfig: {
      // hotUpdate,
      layoutType,
      gridLayout,
      ruleStyle,
      // loadingStyle,
    },
    pageConfig,
    form,
  } = props;

  const [tabKey, setKey] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { pageId } = getParseSearch();

  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  useEffect(() => {
    setKey('1');
    setActiveIndex(0);
    setDrawerVisible(true);
  }, []);

  const onTabsChange = (key, currentIndex) => {
    setActiveIndex(currentIndex);
    if (tabKey === key) {
      setDrawerVisible(false);
      setKey(null);
      return;
    }
    setKey(key);
    setDrawerVisible(true);
  };

  const resetFont = () => {
    const { updatePage } = props;
    updatePage({ fontFamily: '' });
  };

  // const uploadImgProps = {
  //   API_HOST,
  //   pageId,
  //   action: `${API_HOST}/page/upload`,
  //   data: {
  //     id: pageId,
  //     saveKey: 'bgi',
  //     fileType: 'pic',
  //   },
  // };

  // const uploadFileProps = {
  //   API_HOST,
  //   pageId,
  //   action: `${API_HOST}/page/upload`,
  //   clickText: '上传字体',
  //   data: {
  //     id: pageId,
  //     saveKey: 'fontFamily',
  //     fileType: 'fonts',
  //   },
  // };

  // const uploadPagePicProps = {
  //   API_HOST,
  //   pageId,
  //   action: `${API_HOST}/page/upload`,
  //   data: {
  //     id: pageId,
  //     saveKey: 'pageCoverImg',
  //     fileType: 'pic',
  //   },
  // };

  const modalCodeEditProps = {
    form,
    formItemLayout,
    field: 'pageShell',
    data: {
      ...pageConfig,
      pageShell: pageConfig.pageShell || initPageShell,
    },
    formLabel: '',
    btnText: '页面脚本设置',
    btnSize: 'default',
  };

  const isGrid = layoutType && layoutType === 'grid';

  const buttonsArr = [
    { value: '页面', key: '1', show: true },
    { value: '栅格', key: '2', show: isGrid },
    { value: '辅助线', key: '3', show: true },
  ];

  const renderPageContent = {
    '1': (
      <>
        <ModalCodeEdit {...modalCodeEditProps}></ModalCodeEdit>
        <PageBaseConfig form={form} pageId={pageId} resetFont={resetFont} config={pageConfig} />
      </>
    ),
    '2': (
      <>
        <GridLayoutConfig config={{ ...gridLayout }} form={form} />
      </>
    ),
    '3': (
      <>
        <RulerConfig form={form} config={ruleStyle} />
      </>
    ),
  };

  const renderBtnsContent = () => {
    const btns = buttonsArr.filter(b => b.show);
    return btns.map((b, index) => {
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
    });
  };

  return (
    <div
    // className={styles.pageConfig}
    // style={{
    //   height: window.innerHeight - 80 - 45,
    // }}
    >
      <div className={styles.buttonsDiv}>
        {renderBtnsContent()}
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

export default Form.create({
  onFieldsChange: debounce((props, changedFields) => {
    const {
      form: { getFieldsValue },
      updatePageConfig,
      pageConfig,
    } = props;
    const newFields = getFieldsValue();
    const ruleStyle = JSON.stringify(newFields.ruleStyle);
    newFields.ruleStyle = ruleStyle;
    if (pageConfig.layoutType && pageConfig.layoutType === 'grid') {
      const layoutParams = {
        ...pageConfig.gridLayout,
        ...newFields.gridLayout,
      };

      // const { colsNum: prevColsNum } = pageConfig.gridLayout || {};
      // const { colsNum: currentColsNum } = newData.gridLayout || {};
      // const isChangeColsNum = currentColsNum && prevColsNum !== currentColsNum;
      // if (isChangeColsNum) {
      //   const data = [...initUseCompList];
      //   const newCompsList = onLayoutChange(data, layoutParams);
      //   flatArrBatchUpdate && flatArrBatchUpdate(newCompsList);
      // }
      updatePageConfig({ ...newFields, gridLayout: JSON.stringify(layoutParams) });
      return;
    }
    updatePageConfig(newFields);
  }, 300),
})(PageConfig);

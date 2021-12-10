import React, { useState, useEffect } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
// import PropTypes from 'prop-types';
import { Button, Icon, Slider, Modal, message } from 'antd';

import { ProjectsSvg } from '@/assets/menu/index';
import { fullPage } from '@/helpers/static';
import { queryParams } from '@/helpers/menu';
import { fetchPageList, addPage } from '@/service/index';

import UtilsModal from '../UtilsModal';
import CompsList from '../CompsList';
import TopPageList from '../TopPageList';

import AddChildForm from './AddChildForm';
import styles from './index.less';

const LeftDiv = ({
  updateState,
  leftLayerVis,
  pageConfig,
  onChange,
  percentageValue,
  getPluginMenu,
  compMenuList,
  addCusCompToUseCompList,
  onChangePageFetch,
}) => {
  const [visible, setVisible] = useState(false);
  const [addVisible, setAddVisible] = useState(false);
  const [projectVisible, setProjectVisible] = useState(false);
  const [pageListData, setPageList] = useState({});
  const { search, origin, pathname } = window.location;
  const { pageId, tagId } = queryParams(search) || {};

  useEffect(() => {
    fetchPageList({ pageSize: 999, current: 1, tagId: tagId }).then(result => {
      const { errorCode, data } = result;
      if (errorCode === 200) {
        setPageList(data);
      }
    });
  }, [tagId]);

  const fetchPageListFunc = () => {
    fetchPageList({ pageSize: 999, current: 1, tagId: tagId }).then(result => {
      const { errorCode, data } = result;
      if (errorCode === 200) {
        setPageList(data);
      }
    });
  };

  const onChangePage = id => {
    const searchString = `?pageId=${id}&tagId=${tagId}`;
    const newUrl = origin + pathname + searchString;
    window.history.pushState({ id }, id, newUrl);
    onChangePageFetch({ pageId: id, tagId: tagId });
  };

  const btnClick = () => {
    router.push('/screen/page');
  };

  const iconClick = () => {
    updateState({
      leftLayerVis: !leftLayerVis,
    });
  };

  const onAddClick = () => {
    setAddVisible(true);
  };

  const handleCancelAddModal = () => {
    setAddVisible(false);
  };

  const onAddSubmit = values => {
    const params = {
      ...values,
      tagId: pageConfig?.tagId,
      layoutType: pageConfig?.layoutType || 'normal',
    };
    addPage(params).then(res => {
      const { errorCode } = res;
      if (errorCode === 200) {
        handleCancelAddModal();
        fetchPageListFunc();
        message.success('添加成功！');
        return;
      }
      message.error('添加失败！');
    });
  };

  return (
    <div className={styles.container}>
      <Button type="link" onClick={btnClick}>
        返回
      </Button>
      <Icon
        className={styles.icon}
        onClick={iconClick}
        type={leftLayerVis ? 'left-square' : 'right-square'}
      />
      <UtilsModal />
      <div className={styles.bottomDiv}>
        {percentageValue && (
          <Slider
            value={percentageValue}
            min={20}
            onChange={onChange}
            getTooltipPopupContainer={trigger => trigger}
          ></Slider>
        )}
      </div>
      <Icon
        type="fullscreen"
        className={styles.icon}
        onClick={() => {
          fullPage();
        }}
      />
      <div
        className={styles.compsBtn}
        onMouseOver={() => {
          !visible && setVisible(true);
        }}
        onMouseLeave={() => {
          visible && setVisible(false);
        }}
      >
        <div className={styles.btn}>
          <Icon type="bar-chart" />
          组件
        </div>
        <CompsList
          compMenuList={compMenuList}
          getPluginMenu={getPluginMenu}
          visible={visible}
          addCusCompToUseCompList={addCusCompToUseCompList}
        />
      </div>

      <div
        className={styles.compsBtn}
        onMouseOver={() => {
          !projectVisible && setProjectVisible(true);
        }}
        onMouseLeave={() => {
          projectVisible && setProjectVisible(false);
        }}
      >
        <div className={styles.btn}>
          <i className={styles.btnIcon}>
            <ProjectsSvg />
          </i>
          页面
        </div>
        <TopPageList
          data={pageListData}
          currentPageId={pageId}
          visible={projectVisible}
          onItemClick={onChangePage}
          onAddClick={onAddClick}
        />
      </div>

      <Modal
        title="添加子页面"
        visible={addVisible}
        destroyOnClose={true}
        maskClosable={false}
        footer={null}
        onCancel={handleCancelAddModal}
      >
        <AddChildForm onCancel={handleCancelAddModal} onOk={onAddSubmit} />
      </Modal>
    </div>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    updateState: data => {
      dispatch({
        type: 'edit/updateState',
        payload: data,
      });
    },
    getPluginMenu: () => {
      dispatch({
        type: 'edit/getPluginMenu',
      });
    },
    addCusCompToUseCompList: data => {
      dispatch({
        type: 'edit/addCusCompToUseCompList',
        payload: data,
      });
    },
    onChangePageFetch: data => {
      dispatch({
        type: 'edit/initFetch',
        payload: data,
      });
    },
  };
};

export default connect(({ edit }) => {
  return {
    leftLayerVis: edit.leftLayerVis,
    pageConfig: edit.pageConfig,
    compMenuList: edit.compMenuList,
  };
}, mapDispatchToProps)(LeftDiv);

import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import router from 'umi/router';
import classnames from 'classnames';
import html2canvas from 'html2canvas';
import { Form, Layout, Button, Modal, Select, Input, Drawer } from 'antd';
import ThemeConfigModal from '@/components/ThemeConfigModal';

import logo from '@/assets/logo.png';
import { ThemeIcon } from '@/assets/svg/index';
import { BaleSvg } from '@/assets/menu/index';

import styles from './index.less';

const { Header } = Layout;

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

const namespace_theme_edit = 'themeEdit';

function CompHeader(props) {
  const {
    getThemeConfigList,
    addThemeConfig,
    attributeUpdate,
    updatePreviewCompInfo,
    form,
    themeConfigList,
    themeConfigListLoading,
    addThemeLoading,
    selectedCompInfo,
  } = props;
  const { getFieldDecorator, getFieldValue, setFieldsValue, validateFields, resetFields } = form;

  const imageSrc = getFieldValue('imageSrc');
  const compName = selectedCompInfo?.compName;

  const [{ themeReleaseModalVisible, themeConfigListDrawerVisible }, setState] = useState({
    themeReleaseModalVisible: false,
    themeConfigListDrawerVisible: false,
  });

  const updateState = useCallback(payload => setState(state => ({ ...state, ...payload })), []);

  const goHome = useCallback(() => {
    router.push('/screen/page');
  }, []);

  const handleThemeConfigListBtnClick = useCallback(() => {
    getThemeConfigList({ type: compName });
    updateState({ themeConfigListDrawerVisible: true });
  }, [compName, getThemeConfigList, updateState]);

  // 发布主题弹窗
  const handleThemeReleaseModalShow = useCallback(() => {
    const compDom = document.getElementById(compName);
    if (!compDom || !compName) {
      return;
    }
    html2canvas(compDom, { backgroundColor: null, scale: 0.5 }).then(canvas => {
      const imageSrc = canvas.toDataURL();
      setFieldsValue({ imageSrc });
    });
    updateState({ themeReleaseModalVisible: true });
  }, [compName, updateState, setFieldsValue]);

  // 发布主题
  const handleThemeRelease = useCallback(async () => {
    validateFields((errors, values) => {
      if (errors) {
        return;
      }
      const params = {
        ...values,
        type: selectedCompInfo?.compName,
        mockData: selectedCompInfo?.mockData || {},
        style: selectedCompInfo?.style || {},
      };

      addThemeConfig(params).then(success => {
        if (success) {
          updateState({ themeReleaseModalVisible: false });
        }
      });
    });
  }, [selectedCompInfo, updateState, validateFields, addThemeConfig]);

  // 关闭主题发布弹窗
  const handleThemeReleaseCancel = useCallback(() => {
    updateState({ themeReleaseModalVisible: false });
  }, [updateState]);

  // 关闭侧滑栏
  const handleThemeConfigListDrawerClose = useCallback(() => {
    updateState({ themeConfigListDrawerVisible: false });
    updatePreviewCompInfo && updatePreviewCompInfo(null, true);
  }, [updateState, updatePreviewCompInfo]);

  useEffect(() => {
    console.log('selectedCompInfo?.compName', compName);
    if (!compName) {
      return;
    }
    getThemeConfigList({ type: compName });
  }, [compName, getThemeConfigList]);

  return (
    <Header className={styles.header}>
      <img src={logo} alt="logo" className={styles.logo} onClick={goHome} />
      <h1 className={styles.title} onClick={goHome}>
        主题编辑
      </h1>

      <div className={styles.right}>
        <Button
          type="link"
          className={styles.btn}
          onClick={handleThemeConfigListBtnClick}
          loading={themeConfigListLoading}
          disabled={!selectedCompInfo}
        >
          <ThemeIcon />
          主题库
        </Button>
        <Button
          type="link"
          className={styles.btn}
          disabled={!selectedCompInfo}
          onClick={handleThemeReleaseModalShow}
        >
          <BaleSvg />
          发布
        </Button>
      </div>

      <Modal
        title="发布主题"
        width={720}
        visible={themeReleaseModalVisible}
        className={classnames(styles.themeModal, 'dm-modal-default')}
        onOk={handleThemeRelease}
        okButtonProps={{ loading: addThemeLoading }}
        onCancel={handleThemeReleaseCancel}
        afterClose={resetFields}
      >
        <Form.Item label="主题名称" {...formItemLayout}>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请填写主题名称' }],
          })(<Input placeholder="请填写主题名称" />)}
        </Form.Item>
        <Form.Item label="主题类型" {...formItemLayout}>
          {getFieldDecorator('themeType', {
            rules: [{ required: true, message: '请选择主题类型' }],
          })(
            <Select placeholder="请选择主题类型">
              <Select.Option key="default" value="default">
                默认
              </Select.Option>
              <Select.Option key="dark" value="dark">
                暗黑
              </Select.Option>
            </Select>,
          )}
        </Form.Item>

        <Form.Item label="主题预览" {...formItemLayout}>
          {getFieldDecorator('imageSrc', { rules: [{ required: true, message: '图片生成中' }] })(
            <div className={styles.img} style={{ backgroundImage: `url(${imageSrc})` }}>
              {!imageSrc && '图片生成中...'}
            </div>,
          )}
        </Form.Item>
      </Modal>

      <Drawer
        title="主题库"
        width={350}
        visible={themeConfigListDrawerVisible}
        mask={false}
        onClose={handleThemeConfigListDrawerClose}
      >
        <ThemeConfigModal
          data={themeConfigList}
          fetchLoading={themeConfigListLoading}
          itemClick={updatePreviewCompInfo}
          confirmClick={attributeUpdate}
        />
      </Drawer>
    </Header>
  );
}

CompHeader.propTypes = {
  getThemeConfigList: PropTypes.func,
  addThemeConfig: PropTypes.func,
  attributeUpdate: PropTypes.func,
  updatePreviewCompInfo: PropTypes.func,
  form: PropTypes.object,
  themeConfigList: PropTypes.array,
  themeConfigListLoading: PropTypes.bool,
  addThemeLoading: PropTypes.bool,
  selectedCompInfo: PropTypes.object,
};

const mapStateToProps = ({ themeEdit, loading }) => ({
  themeConfigList: themeEdit.themeConfigList,
  themeConfigListLoading: loading.effects[`${namespace_theme_edit}/getThemeConfigList`],
  addThemeLoading: loading.effects[`${namespace_theme_edit}/addThemeConfig`],
});

const mapDispatchToProps = dispatch => ({
  getThemeConfigList: payload =>
    dispatch({ type: `${namespace_theme_edit}/getThemeConfigList`, payload }),
  addThemeConfig: payload => dispatch({ type: `${namespace_theme_edit}/addThemeConfig`, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(CompHeader));

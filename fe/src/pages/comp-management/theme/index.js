import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';

import { compList } from '@/helpers/comp';

import { copyToClip } from '@/helpers/utils';

import {
  Form,
  Button,
  Row,
  Col,
  Card,
  Empty,
  Modal,
  message,
  Icon,
  Tabs,
  Tooltip,
  Input,
  Spin,
} from 'antd';

import CompLib from '@/components/CompLib';
import CodeEdit from '@/components/CodeEditOther';
import DfBackTop from '@/components/DfBackTop';

import styles from './index.less';

const namespace_theme = 'theme';

const Theme = props => {
  const { getThemeConfigList, deleteThemeConfig, form, loading, currentUser } = props;
  const { getFieldDecorator, validateFieldsAndScroll, resetFields } = form;

  // 当前选中的菜单名
  const [compName, setCompName] = useState();
  // 主题列表
  const [dataSource, setDataSource] = useState([]);
  // 主题配置弹窗
  const [codeEditVisible, setCodeEditVisible] = useState(false);
  // 删除主题popover
  const [deleteVisible, setDeleteVisible] = useState(false);
  // 查看主题图片
  const [imgVisible, setImgVisible] = useState(false);
  // 当前点击的卡片内容
  const [current, setCurrent] = useState({});
  // 配置弹窗tabs
  const [activeKey, setActiveKey] = useState('style');
  // 主题名称表单弹窗
  const [themeNameFormVisible, setThemeNameFormVisible] = useState(false);

  const _onTabChange = useCallback(
    key => {
      setActiveKey(key);
    },
    [setActiveKey],
  );

  // 获取主题列表
  const fetchThemeList = useCallback(
    callback => {
      let newDataSource = [];

      getThemeConfigList().then(data => {
        compList.forEach(item => {
          item.child.forEach(child => {
            const children = [];
            data.forEach(d => {
              if (d.type === child.compName) {
                children.push({
                  ...d,
                  label: d.name,
                  key: d.id,
                });
              }
            });
            newDataSource.push({ key: child.compName, label: child.label, children });
          });
        });

        setDataSource(newDataSource);

        callback && callback();
      });
    },
    [getThemeConfigList],
  );

  const itemClick = useCallback(key => {
    setCompName(key);
    // const container = document.getElementById('list-content');
    // const element = document.getElementById(key);

    // if (element && container) {
    //   animateScroll(container, element, 107, 500);
    // }
  }, []);

  const onCodeClick = useCallback(data => {
    setCodeEditVisible(true);
    setCurrent(data);
  }, []);

  const onCodeCopyCancel = useCallback(() => {
    setCodeEditVisible(false);
  }, []);

  const onCopy = useCallback(() => {
    copyToClip(JSON.stringify(current[activeKey]));
  }, [current, activeKey]);

  const gotoDelete = useCallback(
    data => {
      if (currentUser.userName !== 'admin') {
        message.error('您不是管理员，无法删除！');
        return;
      }
      setDeleteVisible(true);
      setCurrent(data);
    },
    [currentUser],
  );

  const onThemeDelete = useCallback(() => {
    const callback = () => setCompName(current.type);

    deleteThemeConfig({ id: current.id }).then(success => {
      if (success) {
        message.success('删除成功');
        setDeleteVisible(false);
        fetchThemeList(callback);
        return;
      }
      message.error('删除失败，请重试');
    });
  }, [current, deleteThemeConfig, fetchThemeList]);

  const onThemeDeleteCancel = useCallback(() => {
    setDeleteVisible(false);
  }, []);

  const onCheckImgClick = useCallback(data => {
    setImgVisible(true);
    setCurrent(data);
  }, []);

  const onCheckImgCancel = useCallback(() => {
    setImgVisible(false);
  }, []);

  const onCopyThemeName = useCallback(data => {
    const name = `${data.type}/${data.indexId}`;
    copyToClip(name);
  }, []);

  const gotoEditThemeName = useCallback(
    data => {
      if (currentUser.userName !== 'admin') {
        message.error('您不是管理员，无法修改！');
        return;
      }
      setThemeNameFormVisible(true);
      setCurrent(data);
    },
    [currentUser],
  );

  const onEditThemeNameOk = useCallback(() => {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      setThemeNameFormVisible(false);
      message.info('接口开发中');
    });
  }, [validateFieldsAndScroll]);

  const onEditThemeNameCancel = useCallback(() => {
    setThemeNameFormVisible(false);
  }, []);

  // 初始化数据
  useEffect(() => {
    fetchThemeList();
  }, [fetchThemeList]);

  // 页面滚动至左侧当前选中的菜单
  useEffect(() => {
    if (!compName) {
      return;
    }
    const element = document.getElementById(compName);

    element && element.scrollIntoView({ behavior: 'smooth' });
  }, [compName]);

  return (
    <div className={styles.container}>
      <div className={styles.sider}>
        <CompLib
          itemClick={itemClick}
          isDefaultExpanAll={true}
          defaultActiveBtnKey="Map"
          activeClassName={styles.active}
        />
      </div>

      <div className={styles.content} id="list-content">
        {loading.effects[`${namespace_theme}/getThemeConfigList`] ? (
          <div className={styles.listLoading}>
            <Spin spinning={true} />
          </div>
        ) : (
          dataSource.map(item => {
            const { children } = item;
            return (
              <div key={item.key + item.label}>
                <h3 className={styles.title} id={item.key}>
                  {item.label}
                  <span>{item.key}</span>
                </h3>
                <Row gutter={[20, 20]} style={{ marginBottom: 40 }}>
                  {children.length ? (
                    children.map(child => (
                      <Col key={child.id} xs={12} lg={6} xl={6} xxl={4}>
                        <Card
                          title={
                            <Tooltip
                              title={child.label}
                              trigger="hover"
                              getPopupContainer={triger => triger}
                            >
                              {child.label}
                            </Tooltip>
                          }
                          bordered={false}
                          hoverable={true}
                          extra={
                            <>
                              <Tooltip
                                title="复制主题名"
                                trigger="hover"
                                getPopupContainer={triger => triger}
                              >
                                <Icon type="copy" onClick={() => onCopyThemeName(child)} />
                              </Tooltip>
                              <Tooltip
                                title="查看图片"
                                trigger="hover"
                                getPopupContainer={triger => triger}
                              >
                                <Icon type="eye" onClick={() => onCheckImgClick(child)} />
                              </Tooltip>
                              <Tooltip
                                title="查看配置"
                                trigger="hover"
                                getPopupContainer={triger => triger}
                              >
                                <Icon type="code" onClick={() => onCodeClick(child)} />
                              </Tooltip>
                              <Tooltip
                                title="重命名"
                                trigger="hover"
                                getPopupContainer={triger => triger}
                              >
                                <Icon type="edit" onClick={() => gotoEditThemeName(child)} />
                              </Tooltip>
                              <Tooltip
                                title="删除"
                                trigger="hover"
                                getPopupContainer={triger => triger}
                              >
                                <Icon type="delete" onClick={() => gotoDelete(child)} />
                              </Tooltip>
                            </>
                          }
                        >
                          <div className={styles.imgBox}>
                            <img src={child.imageSrc} alt="img" />
                          </div>
                        </Card>
                      </Col>
                    ))
                  ) : (
                    <Empty description="暂无主题" />
                  )}
                </Row>
              </div>
            );
          })
        )}
      </div>

      <Modal
        visible={codeEditVisible}
        title="配置"
        onCancel={onCodeCopyCancel}
        width={950}
        footer={
          <div className={styles.footer}>
            <Button type="primary" onClick={onCopy}>
              一键复制
            </Button>
          </div>
        }
      >
        <Tabs activeKey={activeKey} onChange={_onTabChange}>
          {current && current.style && (
            <Tabs.TabPane tab="样式" key="style">
              <CodeEdit
                disCode={true}
                options={{ readOnly: true }}
                value={JSON.stringify(current.style, null, 2)}
                language="json"
                width="100%"
              />
            </Tabs.TabPane>
          )}
          {current && current.mockData && (
            <Tabs.TabPane tab="数据" key="mockData">
              <CodeEdit
                disCode={true}
                options={{ readOnly: true }}
                value={JSON.stringify(current.mockData, null, 2)}
                language="json"
                width="100%"
              />
            </Tabs.TabPane>
          )}
        </Tabs>
      </Modal>

      <Modal
        title="删除主题"
        visible={deleteVisible}
        onCancel={onThemeDeleteCancel}
        onOk={onThemeDelete}
      >
        {`确定要删除主题【${current.label}】吗？`}
      </Modal>

      <Modal
        title="查看主题图片"
        visible={imgVisible}
        onCancel={onCheckImgCancel}
        footer={false}
        width={1100}
        className={styles.imgModal}
      >
        <img src={current.imageSrc} alt="img" />
      </Modal>

      <Modal
        title="主题重命名"
        visible={themeNameFormVisible}
        onOk={onEditThemeNameOk}
        onCancel={onEditThemeNameCancel}
        afterClose={resetFields}
      >
        <Form.Item>
          {getFieldDecorator('themeName', {
            initialValue: (current || {}).name,
            rules: [{ required: true, message: '请输入主题名' }],
          })(<Input placeholder="请输入主题名" />)}
        </Form.Item>
      </Modal>

      <DfBackTop visibilityHeight={400} target={() => document.getElementById('list-content')} />
    </div>
  );
};

Theme.propTypes = {
  getThemeConfigList: PropTypes.func,
  deleteThemeConfig: PropTypes.func,
  form: PropTypes.object,
  loading: PropTypes.object,
  currentUser: PropTypes.object,
};

const mapStateToProps = ({ loading, users }) => ({ loading, currentUser: users.currentUser });

const mapDispatchToProps = dispatch => ({
  getThemeConfigList: payload => dispatch({ type: `${namespace_theme}/getThemeConfigList` }),
  deleteThemeConfig: payload => dispatch({ type: `${namespace_theme}/deleteThemeConfig`, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Theme));

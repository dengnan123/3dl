import { useState, useCallback, useEffect, useMemo } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { getStartTemp, downloadTemp } from '@/helpers/startTemp';
import { startShColumns, defaultEnvConfig } from './const';
import { Button, Layout, Popconfirm, Drawer, Row, Col } from 'antd';
import { StartShModal } from './components/index';
import { SearchWidthTable } from '@/components';

import styles from './index.less';

const namespace_startsh = 'startsh';

function StartSh(props) {
  const { getStartShList, deleteStartSh, startShList, startShListLoading } = props;
  const [visible, setVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [activeData, setActiveData] = useState();

  useEffect(() => {
    getStartShList && getStartShList();
  }, [getStartShList]);

  const handleModalOpen = useCallback(current => {
    setActiveData(current);
    setVisible(true);
  }, []);

  const btnPreview = useCallback(current => {
    setActiveData(current);
    setDrawerVisible(true);
  }, []);

  const btnEdit = useCallback(current => {
    setActiveData(current);
    setVisible(true);
  }, []);

  const handleDelete = useCallback(
    current => {
      deleteStartSh({ ...current, status: 0 });
    },
    [deleteStartSh],
  );

  const columns = useMemo(() => {
    const actionObj = {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 280,
      render: (text, record) => {
        return (
          <>
            <Button
              style={{ paddingLeft: 0 }}
              type="link"
              onClick={() => {
                btnPreview(record);
              }}
            >
              预览
            </Button>
            <Button
              type="link"
              onClick={() => {
                btnEdit(record);
              }}
            >
              编辑
            </Button>
            <Button
              type="link"
              onClick={() => {
                const json = {};
                const jsonList = record?.json;
                if (jsonList) {
                  jsonList.forEach(m => {
                    json[m.key] = m.value;
                  });
                }
                downloadTemp(getStartTemp(json));
              }}
            >
              下载
            </Button>
            <Popconfirm
              placement="top"
              title="确定要删除吗"
              onConfirm={() => handleDelete(record)}
              okText="确定"
              cancelText="取消"
            >
              <Button style={{ paddingRight: 0 }} type="link">
                删除
              </Button>
            </Popconfirm>
          </>
        );
      },
    };
    return [...startShColumns, actionObj];
  }, [btnPreview, btnEdit, handleDelete]);

  // 详情展示
  const drawerDetail = useMemo(() => {
    if (!activeData) {
      return null;
    }
    const json = {};
    const jsonList = activeData?.json;
    if (jsonList) {
      jsonList.forEach(m => {
        json[m.key] = m.value;
      });
    }
    return (
      <>
        {activeData?.json?.map((n, index) => {
          const { key } = n;
          const defaultConfig = defaultEnvConfig[key];
          return (
            <Row key={index} style={{ marginBottom: 10 }}>
              {defaultConfig && (
                <Row>
                  <Col span={11} align="right" style={{ color: '#999' }}>
                    {defaultConfig.label}
                  </Col>
                </Row>
              )}
              <Row>
                <Col span={11} align="right" style={{ color: '#1991eb' }}>
                  {n.key}
                </Col>
                <Col span={2} align="center">
                  ：
                </Col>
                <Col span={11}>{n.value}</Col>
              </Row>
            </Row>
          );
        })}
        <h4 style={{ marginTop: 30 }}>脚本预览</h4>
        <p style={{ whiteSpace: 'pre-line' }}>{getStartTemp(json)}</p>
      </>
    );
  }, [activeData]);

  return (
    <Layout className={styles.container}>
      <SearchWidthTable
        showTitle={false}
        searchKeys={['id', 'name']}
        searchOtherProps={{ placeholder: 'id, 名称', style: { width: 400 } }}
        getTotal={total => (
          <p className={styles.total}>
            总共<span>{total}</span>个启动脚本
          </p>
        )}
        columns={columns}
        dataSource={startShList}
        tableOtherProps={{ pagination: {} }}
        listLoading={startShListLoading}
      />

      <Button type="primary" onClick={() => handleModalOpen()} className={styles.addBtn}>
        添加
      </Button>

      <StartShModal activeData={activeData} visible={visible} setVisible={setVisible} />

      <Drawer
        width={500}
        title="启动脚本变量"
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        mask={false}
      >
        {drawerDetail}
      </Drawer>
    </Layout>
  );
}

StartSh.propTypes = {
  getStartShList: PropTypes.func,
  deleteStartSh: PropTypes.func,
  startShList: PropTypes.array,
  currentUser: PropTypes.object,
  startShListLoading: PropTypes.bool,
};

const mapStateToProps = ({ startsh, loading }) => ({
  startShList: startsh.startShList,
  startShListLoading: loading.effects[`${namespace_startsh}/getStartShList`],
});

const mapDispatchToProps = dispatch => ({
  getStartShList: payload => dispatch({ type: `${namespace_startsh}/getStartShList`, payload }),
  deleteStartSh: payload => dispatch({ type: `${namespace_startsh}/deleteStartSh`, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(StartSh);

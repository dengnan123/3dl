import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Spin, Button, Table, Modal, Empty, Tooltip, Form } from 'antd';
import classnames from 'classnames';

import { fetchRedushDatasourceListById } from '@/service/redash';
import StatementAddModal from '@/components/redash/AddModal';

import MoveForm from './MoveForm';

import styles from './index.less';

function SqlStatements(props) {
  const { currentSql, sqlList, form } = props;
  const [listData, setListData] = useState([]);
  const [modalVis, setModalVis] = useState(false);
  const [moveVis, setMoveVis] = useState(false);
  const [item, setItem] = useState(null);
  const [listLoading, setListLoading] = useState(false); // loading
  const [submitLoading, setSubmitLoading] = useState(false); // loading

  const { validateFields } = form;
  const { id: sqlId, name: sqlName } = currentSql || {};

  useEffect(() => {
    if (!sqlId) return;
    setListLoading(true);
    fetchRedushDatasourceListById({ id: sqlId }).then(res => {
      setListLoading(false);
      const { errorCode, data } = res || {};
      if (errorCode === 200) {
        const listArr = data?.list || [];
        setListData(listArr);
      }
    });
  }, [sqlId]);

  const doApi = useCallback(() => {
    setListLoading(true);
    fetchRedushDatasourceListById({ id: sqlId }).then(res => {
      setListLoading(false);
      const { errorCode, data } = res || {};
      if (errorCode === 200) {
        const listArr = data?.list || [];
        setListData(listArr);
      }
    });
  }, [sqlId]);

  const onClose = useCallback(() => {
    setModalVis(false);
    setMoveVis(false);
    setItem(null);
  }, []);

  // /******Input Search 部分******/
  // const onKeyChange = useCallback(
  //   event => {
  //     const value = event.target.value;
  //     setCompPagination({ ...pagination, keyword: value });
  //     if (!value) {
  //       updateList({ keyword: null });
  //     }
  //   },
  //   [updateList],
  // );

  // const onKeySearch = useCallback(() => {
  //   if (!keyword) {
  //     return;
  //   }
  //   updateList({ keyword: keyword });
  // }, [updateList, keyword]);
  // /******Input Search 部分******/

  const _setQuerySqlId = useCallback(
    id => {
      doApi();
    },
    [doApi],
  );

  const _onItemEdit = useCallback(record => {
    setModalVis(true);
    setItem(record);
  }, []);

  const _onItemMove = useCallback(record => {
    setMoveVis(true);
    setItem(record);
  }, []);

  const onMoveSubmit = () => {
    validateFields((errors, values) => {
      if (!errors) {
        console.log(values, '==s');
      }
    });
  };

  // 删除
  // const _onItemDelete = useCallback(record => {
  //   // const { id } = record;
  //   Modal.confirm({
  //     title: '确认删除该语句？',
  //     cancelText: '取消',
  //     okText: '确定',
  //     // centered: true,
  //     onOk() {
  //       console.log('Deleted');
  //     },
  //     onCancel() {
  //       console.log('Cancel');
  //     },
  //   });
  // }, []);

  // // 分页改变
  // const _onChangePagination = useCallback(
  //   values => {
  //     const { pageSize, current } = values;
  //     setCompPagination({ ...pagination, pageSize, current });
  //     updateList({ pageSize, current });
  //   },
  //   [setCompPagination, pagination],
  // );

  const TableColumns = useMemo(() => {
    return [
      {
        title: '名称',
        dataIndex: 'name',
        align: 'center',
        render: (text, record) => {
          return text;
        },
      },
      {
        title: '查询语句',
        dataIndex: 'query',
        align: 'center',
        render: (text, record) => {
          return <Tooltip title={text}>{text}</Tooltip>;
        },
      },
      {
        title: '编辑时间',
        dataIndex: 'updateTime',
        align: 'center',
        render: (text, record) => {
          return text || '--';
        },
      },
      {
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        width: 300,
        render: (text, record) => {
          return (
            <React.Fragment>
              <Button type="link" onClick={() => _onItemEdit(record)}>
                编辑
              </Button>
              <Button type="link" onClick={() => _onItemMove(record)}>
                移动
              </Button>
            </React.Fragment>
          );
        },
      },
    ];
  }, [_onItemEdit, _onItemMove]);

  if (!sqlId) {
    return (
      <section className={styles.compContent}>
        <div className={styles.empty}>
          <Empty description={<span style={{ color: '#888888' }}>请选择数据库</span>} />
        </div>
      </section>
    );
  }
  const scrollHeight = document.body.offsetHeight - 260;
  return (
    <>
      <section className={styles.compContent}>
        <div className={styles.nameLine}>
          <h2>{sqlName || '--'}</h2>
          <div className={styles.btnWrapper}>
            {/* <Input.Search
            placeholder="根据名称/Key搜索"
            value={keyword}
            onChange={onKeyChange}
            onSearch={onKeySearch}
            onPressEnter={onKeySearch}
          /> */}
            <Button type="primary" onClick={() => setModalVis(true)}>
              添加语句
            </Button>
          </div>
        </div>
        <Spin spinning={listLoading} size="small">
          <Table
            className={classnames('dm-table-primary', styles.table)}
            columns={TableColumns}
            dataSource={listData || []}
            // pagination={{ ...pagination, total, showSizeChanger: true }}
            // onChange={_onChangePagination}
            pagination={false}
            rowKey="id"
            scroll={{ x: '100%', y: scrollHeight }}
          />
        </Spin>
      </section>
      <StatementAddModal
        visible={modalVis}
        data_source_id={sqlId}
        setAddModalVisible={onClose}
        setQuerySqlId={_setQuerySqlId}
        nowQuery={item}
      />
      <Modal
        className={styles.modalMain}
        title="移动到"
        visible={moveVis}
        onCancel={onClose}
        onOk={onMoveSubmit}
        maskClosable={false}
        cancelText="取消"
        okText="移动"
        confirmLoading={submitLoading}
      >
        {moveVis && <MoveForm list={sqlList} form={form} currentItem={currentSql} />}
      </Modal>
    </>
  );
}

SqlStatements.propTypes = {
  currentSql: PropTypes.object,
};

export default Form.create()(SqlStatements);

import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Spin, Icon, Button, message } from 'antd';
import { CreateDatabaseModal } from '@/components/DatabaseConfig/components';
import EditDatabaseModal from './EditForm';
import styles from './index.less';
import { getDdOpts, transformDdOpts } from '@/hooks/redash/const';
import { useAddDatabase, useFetchDatabaseInfo } from '@/hooks/redash';

function SqlSideList(props) {
  const { data, currentSql, onItemClick, fetchList, listLoading } = props;
  const { id } = currentSql || {};
  const [modalVis, setModalVis] = useState(false);
  const [editModalVis, setEditModalVis] = useState(false);
  const [editItem, setEdit] = useState(null); // 当前编辑的数据库
  // const { list } = data || {};
  const { doApi, state } = useAddDatabase();
  const addLoading = state?.value?.loading;

  const { doApi: fetchDataBaseInfo } = useFetchDatabaseInfo();

  const onClick = record => {
    if (record.id === id) return;
    onItemClick(record);
  };

  const onItemEdit = useCallback(
    async record => {
      setEditModalVis(true);
      setEdit(record);
      const resData = await fetchDataBaseInfo({
        id: record.id,
      });
      if (resData.errorCode === 200) {
        const data = transformDdOpts(resData.data);
        setEdit(data);
      }
    },
    [fetchDataBaseInfo, setEdit],
  );

  const onClose = useCallback(() => {
    setModalVis(false);
    setEditModalVis(false);
    setEdit(null);
  }, []);

  const onOk = async v => {
    const data = getDdOpts({
      ...v,
      type: 'mysql',
    });
    if (editItem?.id) {
      const editData = {
        id: editItem.id,
        pause_reason: null,
        paused: 0,
        queue_name: 'queries',
        scheduled_queue_name: 'scheduled_queries',
        syntax: 'sql',
      };
      Object.assign(data, editData);
    }
    console.log('ddddd', data);
    const resData = await doApi(data);
    if (resData.errorCode !== 200) {
      message.error(resData.message);
      return;
    }
    setModalVis(false);
    setEditModalVis(false);
    fetchList();
  };

  return (
    <>
      <section className={styles.sideContent}>
        <div className={styles.classify}>
          <Button type="primary" onClick={() => setModalVis(true)}>
            添加数据库
          </Button>
        </div>
        <Spin spinning={listLoading} size="small">
          <div className={styles.listContent}>
            {data.map(i => {
              const { id: itemId } = i;
              return (
                <div
                  key={itemId}
                  className={classnames(styles.menuItem, { [styles.selected]: itemId === id })}
                >
                  <p onClick={() => onClick(i)}>
                    <Icon type="code" />
                    {i.name}
                  </p>
                  <div className={styles.itemIcon}>
                    <Icon type="edit" onClick={() => onItemEdit(i)} />
                  </div>
                </div>
              );
            })}
          </div>
        </Spin>
        <CreateDatabaseModal
          visible={modalVis}
          onOk={onOk}
          createDatabaseLoading={addLoading}
          onCancel={onClose}
        />
        <EditDatabaseModal
          visible={editModalVis}
          itemInfo={editItem}
          onOk={onOk}
          onCancel={onClose}
        />
      </section>
    </>
  );
}

SqlSideList.propTypes = {
  data: PropTypes.array,
  currentSql: PropTypes.object,
  onItemClick: PropTypes.func,
  onAdd: PropTypes.func,
};

export default SqlSideList;

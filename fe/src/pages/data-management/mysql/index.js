import React, { useState, useEffect, useCallback } from 'react';

import { fetchRedushDatasourceList } from '@/service/redash';
import SqlSideList from './components/SqlSideList';
import SqlStatements from './components/SqlStatements';
import { useFetchDatabaseList } from '@/hooks/redash';

import styles from './index.less';

const sqlParams = { pageSize: 999, current: 1 };

function MysqlPage(props) {
  const [sqlList, setSqlList] = useState([]); // 数据库==数据
  const [currentSql, setCurrentSql] = useState(null); // 当前选择的数据库
  const [sqlLoading, setSqlLoading] = useState(false); // loading
  const { doApi } = useFetchDatabaseList();

  const fetchList = async () => {
    setSqlLoading(true);
    const resData = await doApi();
    if (resData.errorCode === 200) {
      setSqlList(resData.data?.list || []);
    }
    setSqlLoading(false);
  };

  useEffect(() => {
    setSqlLoading(true);
    fetchRedushDatasourceList(sqlParams).then(res => {
      setSqlLoading(false);
      const { errorCode, data } = res || {};
      if (errorCode === 200) {
        const allSql = data?.list || [];
        setSqlList(allSql);
        setCurrentSql(allSql[0] || {});
      }
    });
  }, []);

  const onSideClick = useCallback(
    item => {
      setCurrentSql(item);
    },
    [setCurrentSql],
  );

  const onAddSql = useCallback(values => {}, []);

  return (
    <div className={styles.compWrapper}>
      <SqlSideList
        data={sqlList}
        currentSql={currentSql}
        onItemClick={onSideClick}
        onAdd={onAddSql}
        fetchList={fetchList}
        listLoading={sqlLoading}
      />

      <SqlStatements currentSql={currentSql} sqlList={sqlList} />
    </div>
  );
}

export default MysqlPage;

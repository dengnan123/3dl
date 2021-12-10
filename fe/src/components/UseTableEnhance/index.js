import React, { useEffect, useState, useCallback } from 'react';
import { Table, Input, Button, Drawer } from 'antd';
import { deduplicationArr } from '../../helpers/array';
import { isFunction } from 'lodash';
import PropTypes from 'prop-types';
import styles from './index.less';
import { useDoApi } from '../../hooks/apiHost';
import { useDebounce, useUpdateEffect } from 'react-use';
// import { useGetRowSelection } from './util'

const props = {
  fetchListApi: '',
  addApi: '',
  showSearchInput: true,
  showAddButton: true,
  addButtonText: '新增',
  columns: [],
  antdTableOptions: {},
  refreshList() {},
};

const defFormate = res => {
  if (res.errorCode === 200) {
    return res.data;
  }
  return [];
};

const AntdTable = ({
  columns,
  // openExpand = false,
  // expandInsertIndex,
  // params,
  // openRowSelection = false,
  resDataFormat = defFormate,
  fetchListApi,
  addApi,
  showSearchInput = true,
  showAddButton = true,
  addButtonText = '新增',
  antdTableOptions = {},
  refreshList,
  form,
  addDrawerFormContent,
}) => {
  const [dataSource, setData] = useState([]);
  const [tableColumns, setColumns] = useState(columns);
  const [vis, setVis] = useState(false);
  const [inputValue, setInputValue] = useState();
  const [searchText, setDebouncedValue] = useState();

  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pageSize: 100,
  });

  const { current, pageSize } = pagination;
  const { state, doApi: fetchListFunc } = useDoApi(fetchListApi);
  useEffect(() => {
    console.log('inputDebouncedValueinputDebouncedValue', searchText);
    console.log('pageSize', pageSize);
    console.log('current', current);
    const doFetch = async () => {
      const res = await fetchListFunc({
        current,
        pageSize,
        searchText,
      });
      const list = res?.data || [];
      setData(list);
    };
    doFetch();
  }, [searchText, current, pageSize, fetchListFunc, setData]);

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
  };

  const showDrawer = () => {
    setVis(true);
  };

  useDebounce(
    () => {
      setDebouncedValue(inputValue);
    },
    2000,
    [inputValue],
  );

  const inputChange = e => {
    setInputValue(e.target.value);
  };

  const getAddBtn = () => {
    if (showAddButton) {
      return <Button onClick={showDrawer}>新增</Button>;
    }
  };

  const getInputSearch = () => {
    if (showSearchInput) {
      return <Input onChange={inputChange}></Input>;
    }
  };

  return (
    <div className={['dm-table-primary']}>
      <div className={styles.title}>
        <div>{getInputSearch()}</div>
        {getAddBtn()}
      </div>
      <Table
        columns={tableColumns}
        rowKey={record => record.id}
        dataSource={dataSource}
        pagination={pagination}
        loading={state.loading}
        onChange={handleTableChange}
      />
      <Drawer visible={vis}>
        {isFunction(addDrawerFormContent) ? addDrawerFormContent() : addDrawerFormContent}
      </Drawer>
    </div>
  );
};

AntdTable.propTypes = {
  columns: PropTypes.array,
  fetchApi: PropTypes.func,
  params: PropTypes.object,
  resDataFormat: PropTypes.func,
  openExpand: PropTypes.bool,
  expandInsertIndex: PropTypes.number,
  openRowSelection: PropTypes.bool,
};

export default AntdTable;

import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import classnames from 'classnames';
import moment from 'moment';
import { useUpdateState } from '@/hooks';
import { Pagination, DatePicker, Table, Select, Button, Drawer, Form } from 'antd';

import styles from './index.less';

const { RangePicker } = DatePicker;
// const { Search } = Input;

const defaultPagination = { pageNumber: 1, pageSize: 10 };

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 18, offset: 1 },
};

function Operate(props) {
  const { getLogList, logListLoading, logList, totalLogs, projectList } = props;
  // const searchRef = useRef(null);

  const [{ selectedRow, drawerVisible }, updateState] = useUpdateState({
    selectedRow: null,
    drawerVisible: false,
  });

  const [params, updateParams] = useUpdateState({
    ...defaultPagination,
    keyword: undefined,
    startTime: undefined,
    endTime: undefined,
    tagId: undefined,
  });

  const { pageNumber, pageSize, startTime, endTime, tagId } = params;

  /**
   * 获取列表
   */
  const fetchLoadingList = useCallback(() => {
    const { pageNumber, pageSize, startTime, endTime, tagId } = params;
    getLogList({ pageNumber, pageSize, startTime, endTime, tagId });
  }, [params, getLogList]);

  const handleRangePickerChange = useCallback(
    dates => {
      let time1 = dates?.[0];
      let time2 = dates?.[1];
      if (!time1 || !time2) {
        updateParams({ startTime: undefined, endTime: undefined, ...defaultPagination });
        return;
      }
      time1 = time1.valueOf();
      time2 = time2.valueOf();
      let startTime = Math.min(time1, time2);
      let endTime = Math.max(time1, time2);
      startTime = moment(startTime)
        .startOf('day')
        .valueOf();
      endTime = moment(endTime)
        .endOf('day')
        .valueOf();
      updateParams({ startTime, endTime, ...defaultPagination });
    },
    [updateParams],
  );

  const disabledDate = useCallback(date => {
    const endOfDay = moment()
      .endOf('day')
      .valueOf();

    return date.valueOf() > endOfDay;
  }, []);

  const onChange = useCallback(
    (page, pageSize) => {
      updateParams({ pageNumber: page, pageSize });
    },
    [updateParams],
  );

  /**
   * 搜索框
   */
  // const onSearchChange = useCallback(
  //   e => {
  //     const value = e.target.value;
  //     if (!!value) {
  //       return;
  //     }
  //     // 值为空，说明是清空了
  //     updateParams({ pageNumber: 1, value });
  //   },
  //   [updateParams],
  // );

  // const handleSearch = useCallback(
  //   value => {
  //     updateParams({ pageNumber: 1, keyword: value });
  //   },
  //   [updateParams],
  // );

  /**
   * 项目选择
   */
  const onProjectChange = useCallback(
    v => {
      updateParams({ tagId: v, ...defaultPagination });
    },
    [updateParams],
  );

  const handleDetailClick = useCallback(
    record => {
      updateState({ selectedRow: record, drawerVisible: true });
    },
    [updateState],
  );

  const handleDrawerClose = useCallback(() => {
    updateState({ drawerVisible: false });
  }, [updateState]);

  /**
   * 初始化数据
   */
  useEffect(() => {
    fetchLoadingList();
  }, [fetchLoadingList]);

  const finalColumns = useMemo(() => {
    return [
      ...getColumns(),
      {
        title: '操作详情',
        dataIndex: 'des',
        width: 120,
        render: (text, record) => (
          <Button type="link" style={{ paddingLeft: 0 }} onClick={() => handleDetailClick(record)}>
            查看详情
          </Button>
        ),
      },
    ];
  }, [handleDetailClick]);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div>
          <RangePicker
            className={styles.datePicker}
            placeholder={['开始', '结束']}
            disabledDate={disabledDate}
            value={[startTime ? moment(startTime) : null, endTime ? moment(endTime) : null]}
            onChange={handleRangePickerChange}
          />
          {/* <Search
            ref={searchRef}
            onChange={onSearchChange}
            onSearch={handleSearch}
            allowClear={true}
            placeholder="关键词：操作人"
            className={styles.search}
          /> */}
        </div>

        <span className={styles.selectBox}>
          <Select
            style={{ minWidth: 160 }}
            placeholder="项目"
            allowClear={true}
            value={tagId}
            onChange={onProjectChange}
            className="dm-select-default"
          >
            {projectList.map(n => (
              <Select.Option key={n.id} value={n.id}>
                {n.name}
              </Select.Option>
            ))}
          </Select>
        </span>
      </div>
      <div className={styles.desc}>
        <span className={styles.total}>
          共<span>{totalLogs}</span>条
        </span>
      </div>

      <Table
        className={classnames('dm-table-primary', 'dm-table-padding')}
        rowKey="id"
        dataSource={logList}
        columns={finalColumns}
        pagination={false}
        loading={logListLoading}
      />

      <Pagination
        className="dm-pagination-default"
        current={pageNumber}
        pageSize={pageSize}
        showQuickJumper={true}
        showSizeChanger={true}
        onChange={onChange}
        onShowSizeChange={onChange}
        total={totalLogs}
      />

      <Drawer
        width={560}
        title="操作详情"
        visible={drawerVisible}
        className={styles.drawer}
        onClose={handleDrawerClose}
      >
        <Form.Item label="操作时间" {...formItemLayout}>
          {selectedRow?.createTime
            ? moment(Number(selectedRow?.createTime)).format('YYYY-MM-DD HH:mm')
            : ''}
        </Form.Item>
        <Form.Item label="操作人" {...formItemLayout}>
          {selectedRow?.userName}
        </Form.Item>
        <Form.Item label="操作类型" {...formItemLayout}>
          {selectedRow?.actionName}
        </Form.Item>
        <Form.Item label="所属项目" {...formItemLayout}>
          {selectedRow?.tagName}
        </Form.Item>
        <Form.Item label="页面" {...formItemLayout}>
          {selectedRow?.pageName}
        </Form.Item>
        <Form.Item label="操作详情" {...formItemLayout}>
          <pre>{selectedRow?.des ? JSON.stringify(JSON.parse(selectedRow?.des), null, 2) : ''}</pre>
        </Form.Item>
      </Drawer>
    </div>
  );
}

Operate.propTypes = {
  getLogList: PropTypes.func,
  logListLoading: PropTypes.bool,
  logList: PropTypes.array,
  totalLogs: PropTypes.number,
  projectList: PropTypes.array,
};

const mapStateToProps = ({ loading, operate }) => {
  return {
    logListLoading: loading.effects['operate/getLogList'],
    logList: operate.logList,
    totalLogs: operate.totalLogs,
    projectList: operate.projectList,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getLogList: payload => dispatch({ type: 'operate/getLogList', payload }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Operate);

function getColumns() {
  return [
    {
      title: '操作时间',
      dataIndex: 'createTime',
      ellipsis: true,
      render: time => (time ? moment(Number(time)).format('YYYY-MM-DD HH:mm') : ''),
    },
    {
      title: '操作人',
      dataIndex: 'userName',
      ellipsis: true,
    },
    {
      title: '操作类型',
      dataIndex: 'actionName',
    },
    {
      title: '所属项目',
      dataIndex: 'tagName',
      ellipsis: true,
    },
    {
      title: '页面',
      dataIndex: 'pageName',
      ellipsis: true,
    },
  ];
}

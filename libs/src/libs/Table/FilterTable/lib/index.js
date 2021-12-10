import React, { useState, useCallback, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { useEffectOnce, useCustomCompareEffect } from 'react-use';
import isEqual from 'fast-deep-equal';
import { Spin, ConfigProvider } from 'antd';
import MyFilterTable from '../../../../components/FilterTable';
import zhCN from 'antd/es/locale/zh_CN';
import styles from './index.less';
function FilterTable(props) {
  const { onChange, data, style, shouldClearParams } = props;

  const tableRef = useRef();
  /** onChange往上抛的缓存数据 */
  const onChangeDataRef = useRef({ params: { pageNumber: 1, pageSize: 10 } });

  const total = data?.totalElements || [];
  const dataSource = data?.dataSource || [];

  const _headerStyle = data?._headerStyle || {};
  const _filterStyle = data?._filterStyle || {};
  const _bodyStyle = data?._bodyStyle || {};

  const {
    compKey = 'filterTable',
    bordered = false,
    tProps = { scroll: { x: true } },
    headerBgColor,
    headerFontColor,
  } = style || {};

  let headerStyle = { ..._headerStyle };
  if (headerBgColor) {
    headerStyle['backgroundColor'] = headerBgColor;
  }

  if (headerFontColor) {
    headerStyle['color'] = headerFontColor;
  }

  const [{ pageNumber, pageSize }, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
  });

  const handleOnChange = useCallback(
    params => {
      const { pageSize, pageNumber } = params;
      onChangeDataRef.current = { ...onChangeDataRef.current, params, clickType: 'paramsClick' };
      // console.log('onChange----', { [compKey]: onChangeDataRef.current });
      onChange && onChange({ [compKey]: onChangeDataRef.current });
      setPagination(state => ({ ...state, pageNumber, pageSize }));
    },
    [compKey, onChange],
  );

  const handleRowClick = useCallback(
    record => {
      onChangeDataRef.current = { ...onChangeDataRef.current, clickType: 'rowClick', record };
      // console.log('rowClick', { [compKey]: onChangeDataRef.current });
      onChange && onChange({ [compKey]: onChangeDataRef.current });
    },
    [compKey, onChange],
  );

  const columns = useMemo(() => {
    const _columns =
      data?.columns?.map(n => {
        const actionList = n?.actionList || [];

        if (n.dataIndex === '_action') {
          const renderCol = (text, record) => {
            return actionList?.map((act, index) => {
              const handleShow = act?.handleShow;
              const show = handleShow ? handleShow(record) : true;
              const onColClick = e => {
                e.stopPropagation();
                onChangeDataRef.current = {
                  ...onChangeDataRef.current,
                  clickType: 'actionClick',
                  data: act,
                  record,
                };
                // console.log('操作按钮点击', { [compKey]: onChangeDataRef.current });
                onChange && onChange({ [compKey]: onChangeDataRef.current });
              };
              const colStyle = act?.style || {};
              if (!show) return null;
              return (
                <span key={index} style={colStyle} onClick={onColClick}>
                  {act.name}
                </span>
              );
            });
          };
          return { ...n, render: renderCol };
        }
        return n;
      }) || [];
    return _columns;
  }, [compKey, data.columns, onChange]);

  /** 重置条件 */
  useCustomCompareEffect(
    () => {
      // console.log('shouldClearParams...',shouldClearParams)
      if (!tableRef.current || !shouldClearParams) return;
      onChangeDataRef.current = {
        ...onChangeDataRef.current,
        clickType: undefined,
        params: { pageNumber: 1, pageSize: 10 },
      };
      console.log('重置', shouldClearParams);
      // console.log('onChange', { [compKey]: onChangeDataRef.current });
      tableRef.current.resetFilter();
      setPagination(state => ({ ...state, pageNumber: 1, pageSize: 10 }));
      onChange && onChange({ [compKey]: onChangeDataRef.current });
    },
    [shouldClearParams, compKey, setPagination, onChange],
    (prevDeps, nextDeps) => {
      const preProps = prevDeps[0];
      const nextProps = nextDeps[0];
      return isEqual(preProps, nextProps);
    },
  );

  /**
   * 初始化数据
   */
  useEffectOnce(() => {
    console.log('初始化--', { [compKey]: onChangeDataRef.current });
    onChangeDataRef.current = {
      ...onChangeDataRef.current,
      clickType: undefined,
      params: { pageNumber: 1, pageSize: 10 },
    };
    setPagination(state => ({ ...state, pageNumber: 1, pageSize: 10 }));
    onChange && onChange({ [compKey]: onChangeDataRef.current });
  });

  return (
    <ConfigProvider locale={zhCN}>
      <Spin spinning={Boolean(props?.loading)}>
        <div className={styles.container}>
          <MyFilterTable
            ref={tableRef}
            rowKey={(record, index) => index}
            columns={columns}
            dataSource={dataSource}
            onChange={handleOnChange}
            onClickRow={handleRowClick}
            headerStyle={headerStyle}
            bodyStyle={_bodyStyle}
            filterStyle={_filterStyle}
            tProps={{
              bordered,
              align: 'center',
              pagination: {
                total,
                showTotal: (totalElements, range) => {
                  return (
                    <span>{`共${totalElements}条,第${pageNumber}/${Math.ceil(
                      totalElements / pageSize,
                    )}页`}</span>
                  );
                },
                current: pageNumber,
                pageSize,
                size: 'default',
                hideOnSinglePage: false,
                showQuickJumper: true,
                showSizeChanger: true,
              },
              ...tProps,
            }}
          />
        </div>
      </Spin>
    </ConfigProvider>
  );
}

FilterTable.propTypes = {
  onChange: PropTypes.func,
  data: PropTypes.object,
  style: PropTypes.object,
  shouldClearParams: PropTypes.bool,
};

export default FilterTable;

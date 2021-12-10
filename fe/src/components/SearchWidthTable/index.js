import { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDebounce } from '@react-hook/debounce';
import classnames from 'classnames';
import { Table, Input } from 'antd';
import styles from './index.less';
const { Search } = Input;

function SearchWidthTable(props) {
  const {
    className,
    searchClassName,
    tableClassName,
    showTitle,
    title,
    searchKeys,
    searchOtherProps,
    showTotal,
    getTotal,
    columns,
    pagination,
    dataSource,
    tableOtherProps,
    listLoading,
  } = props;

  const [keywords, setKeywords] = useDebounce(undefined, 800);

  const handleSearch = useCallback(
    e => {
      const value = e.target.value;
      setKeywords(value);
    },
    [setKeywords],
  );

  const { finalDataSource } = useMemo(() => {
    const _searchKeys = searchKeys || [];
    let str = '';
    const finalDataSource = (dataSource || []).filter(item => {
      for (let key of _searchKeys) {
        str += item[key];
      }

      return `${str}`.toLowerCase().includes((keywords || '').trim().toLowerCase());
    });
    return { finalDataSource };
  }, [dataSource, keywords, searchKeys]);

  const total = useMemo(() => {
    return showTotal && getTotal ? (
      getTotal(finalDataSource.length)
    ) : (
      <p className={styles.total}>
        一共<span>{finalDataSource.length}</span>条
      </p>
    );
  }, [showTotal, getTotal, finalDataSource]);

  return (
    <div className={classnames(styles.container, className)}>
      {showTitle && <h3>{title}</h3>}
      <Search
        className={classnames(styles.search, searchClassName)}
        onChange={handleSearch}
        allowClear={true}
        placeholder="配置id，名称"
        {...searchOtherProps}
      />
      {total}
      <Table
        className={classnames(styles.table, 'dm-table-primary', tableClassName)}
        rowKey="id"
        dataSource={finalDataSource}
        columns={columns}
        loading={listLoading}
        pagination={
          pagination
            ? {
                className: 'dm-pagination-default',
                showQuickJumper: true,
                showSizeChanger: true,
                ...pagination,
              }
            : false
        }
        {...tableOtherProps}
      />
    </div>
  );
}

SearchWidthTable.defaultProps = {
  showTotal: true,
};

SearchWidthTable.propTypes = {
  className: PropTypes.string,
  searchClassName: PropTypes.string,
  tableClassName: PropTypes.string,
  listLoading: PropTypes.bool,
  searchKeys: PropTypes.array,
  searchOtherProps: PropTypes.object,
  showTitle: PropTypes.bool,
  title: PropTypes.node,
  showTotal: PropTypes.bool,
  getTotal: PropTypes.func,
  total: PropTypes.element,
  dataSource: PropTypes.array,
  columns: PropTypes.array,
  pagination: PropTypes.oneOf([PropTypes.bool, PropTypes.object]),
  tableOtherProps: PropTypes.object,
};

export default SearchWidthTable;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Tooltip } from 'antd';
import FilterDefaultComponent from './items';
import { get } from 'lodash';
import styles from './index.less';
import { closestPolyfill } from './util';

const sortDirectionsMap = {
  ascend: 'asc',
  descend: 'desc',
};
/**
 * 默认分页
 */
const DEFAULT_PAGINATION = {
  pageNumber: 1,
  pageSize: 10,
};
/**
 * 筛选表格
 */
class FilterTable extends Component {
  static propTypes = {
    // 表格渲染配置请查看README.md
    columns: PropTypes.array,
    id: PropTypes.string, // 表单id 当同时存在两个表单时
    dataSource: PropTypes.any, // 表格数据
    pagination: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]), // 分页参数
    onChange: PropTypes.func, // 搜索条件、分页、排序变化时触发事件
    onLoadFinish: PropTypes.func, // 加载数据完成，设置action时生效
    disabledFilter: PropTypes.bool, // 禁用筛选, 展示结果与正常表格一致
    clickRowSelected: PropTypes.bool, // 点击行时，是否添加选择样式
    onClickRow: PropTypes.func, // 点击行触发的事件
    action: PropTypes.any, // 表格数据请求配置
    actionParams: PropTypes.object, // 表格数据请求参数
    initLoad: PropTypes.bool, // 是否初始化时加载数据
    initLoadParams: PropTypes.object, // 初始化时加载默认参数
    tProps: PropTypes.any, // table组件其他参数，与antd table一致
    paginationProps: PropTypes.object,
    rowKey: PropTypes.any,
    filterEmptyValue: PropTypes.bool, // 是否去除空值的字段
    className: PropTypes.any,
    headerStyle: PropTypes.object, // Header样式
    bodyStyle: PropTypes.object, // Body样式
  };
  static defaultProps = {
    id: Math.random()
      .toString(36)
      .substr(2),
    pagination: DEFAULT_PAGINATION,
    // onChange: async () => {},
    initLoad: true,
  };
  state = {
    loading: false,
    columns: [],
    tableData: [],
    pagination: {
      pageNumber: 1,
      pageSize: 10,
      totalElements: 0,
    },
  };
  components = {
    body: {
      cell: TooltipCell,
    },
  };
  tableBoxRef = null;
  _queryParams = {
    ...DEFAULT_PAGINATION,
  };
  componentDidUpdate(prevProps) {
    if (prevProps.columns !== this.props.columns) {
      this.setState({ columns: this._getColumnsFromProps() });
    }
  }
  componentDidMount() {
    this.setState({ columns: this._getColumnsFromProps() });
    const { initLoad, initLoadParams } = this.props;
    if (initLoad) {
      if (initLoadParams) {
        this._queryParams = { ...this._queryParams, ...initLoadParams };
      }
      this.load(this.getTableParams());
    }
  }
  resetFilter = async (reload, params) => {
    await this.setState({ columns: this._getColumnsFromProps(true) });
    const { initLoadParams } = this.props;
    this._queryParams = { ...DEFAULT_PAGINATION, ...initLoadParams };
    await this.setState({ columns: this._getColumnsFromProps() });
    if (reload) await this.load(params);
  };
  /** 重新加载数据 */
  load = async params => {
    const { action, actionParams, onLoadFinish } = this.props;
    if (!action) return;
    try {
      await this.setState({ loading: true });
      const requestParams = params || this.getTableParams();
      let { pageNumber, pageSize, totalElements, content, totalPages } = await action({
        ...actionParams,
        ...requestParams,
      });
      // 非第一页请求空数据时，再次请求最大页数数据
      if ((!content || !content.length) && Number(pageNumber) !== 1) {
        const result = await action({
          ...actionParams,
          ...requestParams,
          pageNumber: totalPages,
        });
        pageNumber = result.pageNumber;
        pageSize = result.pageSize;
        totalElements = result.totalElements;
        content = result.content;
      }
      await this.setState({
        loading: false,
        tableData: content,
        pagination: {
          pageNumber,
          pageSize,
          totalElements,
        },
      });
      onLoadFinish && onLoadFinish({ pageNumber, pageSize, totalElements, content });
    } catch (error) {
      this.setState({
        loading: false,
      });
    }
  };
  /** 设置loading状态 */
  loading = loading => this.setState({ loading });
  /** 获取table 当前页的数据 */
  getTableData = () => ({
    content: this.state.tableData,
    ...this.state.pagination,
  });
  /** 获取table filter 参数 */
  getTableParams = () => {
    const { filterEmptyValue = true } = this.props;
    // 过滤空值
    return Object.keys(this._queryParams).reduce((obj, key) => {
      const value = this._queryParams[key];
      if (!filterEmptyValue) {
        obj[key] = value;
      } else {
        if (value || value === 0) {
          obj[key] = value;
        }
      }

      return obj;
    }, {});
  };
  //
  /** 清除选中的样式 */
  clearRowSelected = () => {
    const activeEls = this.tableBoxRef.getElementsByClassName(styles.activeClass);
    for (const el of activeEls) {
      el.classList.remove(styles.activeClass);
    }
  };
  _renderChildren = (col, index) => {
    const { disabledFilter } = this.props;
    const { title, dataIndex, key, filterRender, noFilter, editor, ...props } = col;
    if (disabledFilter) {
      return { dataIndex };
    }
    let titleComponent = (
      <FilterDefaultComponent
        column={col}
        onFilterChange={this._onFilterChange}
        onFilterSearch={this._onFilterSearch}
      />
    );
    // 不传递
    if (noFilter || editor) titleComponent = '';
    if (filterRender) titleComponent = this._withComposeProps(filterRender);

    return {
      // 默认添加搜索文本框
      children: [
        {
          title: titleComponent,
          dataIndex,
          ellipsis: true,
          ...props,
        },
      ],
    };
  };
  _getColumnsFromProps = init => {
    // 处理columns数据，添加默认值
    const { columns = [], disabledFilter } = this.props;

    return columns
      .filter(item => !!item)
      .map((col, index) => {
        const {
          title,
          dataIndex,
          key,
          filterRender,
          noFilter,
          sorter = true,
          editor,
          fixed,
          ...props
        } = col;
        if (init) {
          return {
            title,
            sorter: false,
            sortOrder: false,
            dataIndex,
            fixed,
          };
        }
        return {
          title,
          // 默认打开排序-- key为editor时默认关闭排序
          sorter: editor ? false : sorter,
          ...this._renderChildren(col, index),
          key: key || dataIndex,
          props: col,
          fixed,
          ...(disabledFilter ? { ...props, ellipsis: true, sorter: false } : false),
        };
      });
  };
  _withComposeProps(Component, props) {
    return (
      <Component onFilterChange={this._onFilterChange} onFilterSearch={this._onFilterSearch} />
    );
  }

  _emitChange = async queryParams => {
    // 获取填写的参数
    const params = this.getTableParams();
    const { onChange, action } = this.props;
    // 判断是否将action托管给table
    if (!action) this.setState({ loading: true });
    onChange && (await onChange(params));
    if (!action) this.setState({ loading: false });
    if (!onChange) this.load(params);
  };
  _onChangeTable = (pagination, filters, sorter, extra, ...pro) => {
    // 拼装查询条件
    const { current, pageSize } = pagination;
    const { column, columnKey, order } = sorter;
    const sortKey = get(column, ['props', 'sortKey']);
    this._queryParams = Object.assign(this._queryParams, {
      pageNumber: current,
      pageSize,
      pageSort: columnKey && order ? `${sortKey || columnKey}-${sortDirectionsMap[order]}` : null,
    });
    this._emitChange();
  };
  // 显示数据信息
  _showTotal = (pageNumber, pageSize, totalElements) => {
    return (
      <span>{`共${totalElements}条,第${pageNumber}/${Math.ceil(totalElements / pageSize)}页`}</span>
    );
  };
  // 筛选行值发生变化时
  _onFilterChange = params => {
    this._queryParams = Object.assign(this._queryParams, params);
  };
  // 提交筛选项的值，触发请求
  _onFilterSearch = param => {
    if (param) this._onFilterChange(param);
    // 重置搜索页未第一页
    this._queryParams.pageNumber = DEFAULT_PAGINATION.pageNumber;
    this._emitChange();
  };
  _pagination = () => {
    const { pagination, action, paginationProps } = this.props;
    const { pagination: statePagination } = this.state;
    const { pageNumber, pageSize, totalElements } =
      (action ? statePagination : pagination) || DEFAULT_PAGINATION;
    return {
      showSizeChanger: true, // 是否可以改变 pageSize
      showTotal: this._showTotal.bind(this, pageNumber, pageSize, totalElements), // 用于显示数据总量和当前数据顺序
      showQuickJumper: true, // 是否可以快速跳转至某页
      // hideOnSinglePage: true, // 只有一页时是否隐藏分页器
      current: Number(pageNumber),
      pageSize: Number(pageSize),
      total: Number(totalElements || 0),
      size: 'default',
      ...paginationProps,
    };
  };
  // 行点击事件，用于添加行选中效果
  _onClickRowMap = row => ({
    onClick: event => this._onClickRow(row, event),
  });
  _onClickRow = (row, event) => {
    const { target } = event;
    const role = target.getAttribute('role');
    // 点击tooltip不触发事件
    if (role === 'tooltip') {
      return;
    }
    const { clickRowSelected, onClickRow } = this.props;
    if (clickRowSelected) {
      const tr = target.closest ? target.closest('tr') : closestPolyfill(target, 'tr');
      if (tr && tr.classList) {
        this.clearRowSelected();
        tr.classList.add(styles.activeClass);
      }
    }
    onClickRow && onClickRow(row, event);
  };
  _onRowProp = row => {
    const { tProps } = this.props;
    const clickRowMap = this._onClickRowMap(row);
    return tProps && tProps.onRow ? Object.assign(tProps.onRow(row), clickRowMap) : clickRowMap;
  };
  render() {
    const {
      dataSource,
      tProps,
      id,
      action,
      rowKey,
      className,
      headerStyle,
      filterStyle,
      bodyStyle,
    } = this.props;
    const { columns, loading, tableData } = this.state;

    let columnsArr = columns.map(c => {
      const { children } = c;
      const onCellFunc = (r, i) => {
        return {
          style: bodyStyle,
        };
      };
      let config = {};
      if (children) {
        config['children'] = children.map(c => {
          return {
            ...c,
            onCell: (record, rowIndex) => {
              return onCellFunc(record, rowIndex);
            },
            onHeaderCell: item => {
              return {
                style: filterStyle,
              };
            },
          };
        });
      } else {
        config = {
          onCell: (record, rowIndex) => {
            return onCellFunc(record, rowIndex);
          },
        };
      }
      return {
        ...c,
        onHeaderCell: item => {
          return {
            style: headerStyle,
          };
        },
        ...config,
      };
    });
    return (
      <div className={styles.filterTable_wrap} ref={ref => (this.tableBoxRef = ref)}>
        <Table
          id={id}
          columns={columnsArr}
          dataSource={action ? tableData : dataSource}
          components={this.components}
          onChange={this._onChangeTable}
          loading={loading}
          pagination={this._pagination()}
          className={`${styles.filterTable} ${className || ''}`}
          // bordered
          size="middle"
          onRow={this._onRowProp}
          rowKey={rowKey || 'id'}
          tableLayout="fixed"
          {...tProps}
        />
      </div>
    );
  }
}

function TooltipCell(props) {
  const { title, children, ...tdProps } = props;
  if (title) {
    return (
      <td {...tdProps}>
        <Tooltip placement="topLeft" title={title}>
          {children}
        </Tooltip>
      </td>
    );
  }
  return <td {...props} />;
}
TooltipCell.propTypes = {
  title: PropTypes.any,
  children: PropTypes.any,
};

FilterTable.DEFAULT_PAGINATION = DEFAULT_PAGINATION;
export default FilterTable;

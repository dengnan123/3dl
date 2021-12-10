import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import classnames from 'classnames';
import { Form, Button, Table, Input, Select, InputNumber, Popconfirm, message, Icon } from 'antd';
import ModalHead from '../ModalHead';
import { ChartCompNameEnums, ChartTypeEnums } from '../const';
import { ChartMockData } from '../mockData';
import {
  tableDataToMockdata,
  mockdataToTableData,
  excelToTableData,
  downloadExcelByMockData,
} from './utils';
import styles from './index.less';

const { Item: FormItem } = Form;

function getChartTypeSelect(compName) {
  let content = null;
  switch (compName) {
    case ChartCompNameEnums.Pie:
      content = <Select.Option value={ChartTypeEnums.Pie}>{ChartTypeEnums.Pie}</Select.Option>;
      break;
    case ChartCompNameEnums.Line:
      content = <Select.Option value={ChartTypeEnums.Line}>{ChartTypeEnums.Line}</Select.Option>;
      break;
    case ChartCompNameEnums.Bar:
      content = <Select.Option value={ChartTypeEnums.Bar}>{ChartTypeEnums.Bar}</Select.Option>;
      break;
    default:
      content = [
        <Select.Option key={ChartTypeEnums.Line} value={ChartTypeEnums.Line}>
          {ChartTypeEnums.Line}
        </Select.Option>,
        <Select.Option key={ChartTypeEnums.Bar} value={ChartTypeEnums.Bar}>
          {ChartTypeEnums.Bar}
        </Select.Option>,
      ];
  }
  return content;
}

function CommonContent(props) {
  const { propsForm, form, data } = props;
  const { getFieldDecorator, validateFieldsAndScroll } = form;

  const dataRef = useRef();
  const chartCompName = data?.compName;
  const mockData = data?.mockData;

  const [columnEdit, setColumnEdit] = useState(false);
  const [editingKey, setEditingKey] = useState();

  const [categories, setCategories] = useState([]);
  const [dataSource, setDataSource] = useState([]);

  // 初始化table数据
  useEffect(() => {
    if (!dataRef.current || JSON.stringify(dataRef.current) !== JSON.stringify(mockData)) {
      dataRef.current = mockData;
      const { categories, dataSource } = mockdataToTableData(mockData, chartCompName);
      setCategories(categories);
      setDataSource(dataSource);
    }
  }, [mockData, chartCompName]);

  useEffect(() => {
    const mockData = tableDataToMockdata({ categories, dataSource });
    if (dataRef.current && JSON.stringify(dataRef.current) !== JSON.stringify(mockData)) {
      dataRef.current = mockData;
      propsForm.setFieldsValue({ mockData: JSON.stringify(mockData, null, 2) });
    }
  }, [categories, dataSource, propsForm]);

  // 下载模板
  const handleDownloadExcel = useCallback(() => {
    const mockData = ChartMockData[chartCompName];
    downloadExcelByMockData({
      mockData,
      filename: chartCompName,
    });
  }, [chartCompName]);

  // 导出模板
  const handleExportExcel = useCallback(() => {
    downloadExcelByMockData({
      mockData: { categories, series: dataSource },
      filename: chartCompName,
    });
  }, [categories, dataSource, chartCompName]);

  // 保存数据x轴数据，categories
  const handleSaveCategories = useCallback(() => {
    validateFieldsAndScroll((errors, values) => {
      if (errors && errors.editCategories) {
        return;
      }
      const { editCategories } = values;
      setCategories(editCategories);
      setColumnEdit(false);
    });
  }, [validateFieldsAndScroll]);

  // 添加一列数据
  const handleAddCol = useCallback(
    index => {
      const _c = [...categories];
      _c.splice(index, 0, '新增类目轴');
      const _d = dataSource.map(n => {
        const data = [...n?.data];
        data.splice(index, 0, { name: '', value: 0 });
        return { ...n, data };
      });
      setCategories(_c);
      setDataSource(_d);
    },
    [categories, dataSource],
  );

  // 删除一列数据
  const handleDeleteCol = useCallback(
    index => {
      const _c = categories.filter((n, i) => i !== index);
      const _d = dataSource.map(n => {
        const data = n?.data?.filter((m, j) => j !== index);
        return { ...n, data };
      });
      setCategories(_c);
      setDataSource(_d);
    },
    [categories, dataSource],
  );

  // 添加一行
  const handleAdd = useCallback(() => {
    const _d = [...dataSource];

    const item = {
      id: uuid(),
      type: ChartTypeEnums[chartCompName] || 'line',
      name: '新增数据维度',
      data: Array(categories.length).fill({ name: '', value: 0 }),
    };
    _d.push(item);
    setDataSource(_d);
  }, [dataSource, categories, chartCompName]);

  // 处理Excel导入数据
  const handleDealExcelData = useCallback(
    jsonArr => {
      try {
        const { categories, dataSource } = excelToTableData(jsonArr, chartCompName);
        setCategories(categories);
        setDataSource(dataSource);
        setEditingKey();
      } catch (err) {
        message.error(err.message || '模板格式错误');
      }
    },
    [chartCompName],
  );

  // 保存编辑行
  const handleSaveEditItem = useCallback(
    record => {
      validateFieldsAndScroll((errors, values) => {
        if (errors && errors.editItem) {
          return;
        }
        const { editItem } = values;
        setDataSource(d =>
          d.map(n => {
            if (n.id === record.id) {
              return { ...n, ...editItem };
            }
            return n;
          }),
        );
        setEditingKey();
      });
    },
    [validateFieldsAndScroll],
  );

  // 删除行
  const handleDeleteItem = useCallback(
    record => {
      const _d = dataSource.filter(n => n.id !== record.id);
      setDataSource(_d);
    },
    [dataSource],
  );

  const columns = [
    {
      title: '数据维度',
      dataIndex: 'name',
      width: 140,
      render: (text, record) => {
        const editing = editingKey === record.id;
        return !editing ? (
          text
        ) : (
          <FormItem>
            {getFieldDecorator(`editItem.name`, {
              initialValue: text,
              rules: [{ required: true, message: '请输入' }],
            })(<Input />)}
          </FormItem>
        );
      },
    },
    {
      title: '数据',
      dataIndex: 'data',
      children: !!categories.length
        ? categories.map((n, i) => {
            return {
              title: !columnEdit ? (
                <span className={styles.col}>
                  {n}
                  <span className={styles.actionPanel}>
                    <Popconfirm title="确定删除当前列吗？" onConfirm={() => handleDeleteCol(i)}>
                      <Icon type="close" className={styles.deleteIcon} />
                    </Popconfirm>
                    <Icon
                      type="plus-circle"
                      className={styles.plusIconLeft}
                      onClick={() => handleAddCol(i)}
                    />
                    <Icon
                      type="plus-circle"
                      className={styles.plusIconRight}
                      onClick={() => handleAddCol(i + 1)}
                    />
                  </span>
                </span>
              ) : (
                <FormItem>
                  {getFieldDecorator(`editCategories[${i}]`, {
                    initialValue: n,
                    rules: [{ required: true, message: '请输入' }],
                  })(<Input />)}
                </FormItem>
              ),
              dataIndex: i + 1,
              width: categories.length > 4 ? 120 : 'unset',
              render: (text, record) => {
                const { id, data } = record;
                const value = data?.[i]?.value;
                const editing = editingKey === id;
                return !editing ? (
                  value
                ) : (
                  <FormItem>
                    {getFieldDecorator(`editItem.data[${i}].value`, {
                      initialValue: value,
                      rules: [{ required: true, message: '请输入' }],
                    })(<InputNumber />)}
                  </FormItem>
                );
              },
            };
          })
        : [
            {
              title: (
                <Icon
                  type="plus-circle"
                  className={styles.plusIconLeft}
                  onClick={() => handleAddCol(0)}
                />
              ),
              dataIndex: 'addCol',
              render: null,
            },
          ],
    },
    {
      title: '图表类型',
      dataIndex: 'type',
      width: 100,
      render: (text, record) => {
        const editing = editingKey === record.id;
        const disabled = chartCompName !== ChartCompNameEnums.LineAndBar;
        return !editing ? (
          text
        ) : (
          <FormItem>
            {getFieldDecorator(`editItem.type`, {
              initialValue: text,
              rules: [{ required: true, message: '请选择' }],
            })(<Select disabled={disabled}>{getChartTypeSelect(chartCompName)}</Select>)}
          </FormItem>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'action',
      fixed: 'right',
      children: [
        {
          title: !columnEdit ? (
            <span className={styles.btn} onClick={() => setColumnEdit(true)}>
              编辑
            </span>
          ) : (
            <>
              <span
                className={styles.btn}
                style={{ marginRight: 8 }}
                onClick={handleSaveCategories}
              >
                保存
              </span>
              <span className={styles.btn} onClick={() => setColumnEdit(false)}>
                取消
              </span>
            </>
          ),
          dataIndex: 'edit',
          width: 120,
          render: (text, record) => {
            const editing = editingKey === record.id;
            const editDisabled = editingKey && !editing;
            return (
              <>
                {!editing ? (
                  <>
                    <Button
                      type="link"
                      disabled={editDisabled}
                      onClick={() => setEditingKey(record.id)}
                    >
                      编辑
                    </Button>
                    <Popconfirm
                      disabled={editDisabled}
                      title="确定删除吗？"
                      onConfirm={() => handleDeleteItem(record)}
                    >
                      <Button
                        disabled={editDisabled}
                        type="link"
                        style={{ color: !editDisabled ? 'red' : 'rgba(0, 0, 0, 0.25)' }}
                      >
                        删除
                      </Button>
                    </Popconfirm>
                  </>
                ) : (
                  <>
                    <Button type="link" onClick={() => handleSaveEditItem(record)}>
                      保存
                    </Button>
                    <Button type="link" onClick={() => setEditingKey()}>
                      取消
                    </Button>
                  </>
                )}
              </>
            );
          },
        },
      ],
    },
  ];

  return (
    <div className={styles.container}>
      <ModalHead
        handleDealExcelData={handleDealExcelData}
        handleAdd={handleAdd}
        handleDownloadExcel={handleDownloadExcel}
        handleExportExcel={handleExportExcel}
      />
      <Table
        rowKey="id"
        className={classnames(styles.table, 'dm-table-primary')}
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: 'calc(100% - 120px)', y: false }}
      />
    </div>
  );
}

CommonContent.propTypes = {
  propsForm: PropTypes.object,
  form: PropTypes.object,
  data: PropTypes.object,
  chartCompName: PropTypes.string,
};

export default Form.create()(CommonContent);

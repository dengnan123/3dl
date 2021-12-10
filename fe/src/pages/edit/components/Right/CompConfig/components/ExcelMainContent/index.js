import React, { useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import { Form, Table, message } from 'antd';

import ExcelDownloadHead from './ExcelDownloadHead';
import InputFormItem from './InputFormItem';
import SelectFormItem from './SelectFormItem';
import {
  setInitialMockDataToTable,
  tableDataToMock,
  excelToTableData,
  downloadExcelByMockData,
} from './utils';
import { eChartMockData } from './echartMockData';
import styles from './index.less';

const charCodeInit = 65;
const columns_number = 20;

function ExcelMainContent(props) {
  const { data, propsForm, initMockData } = props;
  const { compName } = data;

  const [rowsData, setRows] = useState([]);

  useEffect(() => {
    // 设置DataSource
    const tableData = setInitialMockDataToTable(initMockData, compName);
    setRows(tableData);
  }, [initMockData, compName]);

  // 下载模板
  const handleDownloadExcel = useCallback(() => {
    const mockData = eChartMockData[compName];
    downloadExcelByMockData({
      mockData,
      filename: compName,
    });
  }, [compName]);

  // 导出模板
  const handleExportExcel = useCallback(() => {
    const dataValues = tableDataToMock(rowsData, data);
    downloadExcelByMockData({
      mockData: dataValues,
      filename: compName,
    });
  }, [compName, rowsData, data]);

  // 处理Excel导入数据
  const handleDealExcelData = useCallback(
    jsonArr => {
      try {
        const tableData = excelToTableData(jsonArr, compName);
        const dataValues = tableDataToMock(tableData, data);
        propsForm.setFieldsValue({ mockData: JSON.stringify(dataValues, null, 2) });
        setRows(tableData);
      } catch (err) {
        message.error(err.message || '模板格式错误');
      }
    },
    [compName, data],
  );

  // Tables
  const _onFieldChange = useCallback(
    (rowId, key, val) => {
      const modifiedRows = [].concat(rowsData);
      let row = modifiedRows.find(row => {
        return row.rowId === rowId;
      });
      _.set(row, key, val);
      const dataValues = tableDataToMock(rowsData, data);
      propsForm.setFieldsValue({ mockData: JSON.stringify(dataValues, null, 2) });
      setRows(modifiedRows);
    },
    [rowsData, data],
  );

  // 设置Table Columns
  const RenderColumns = useMemo(() => {
    let columnsArr = [
      {
        title: '序列',
        dataIndex: 'rowId',
        textAlign: 'center',
        width: 60,
        fixed: 'left',
      },
    ];
    const rightColumn = {
      title: '类型',
      dataIndex: 'type',
      textAlign: 'center',
      width: 100,
      fixed: 'right',
      render: (text, record, index) => {
        if (index === 0) {
          return '';
        }
        return (
          <SelectFormItem
            formValue={text}
            compName={compName}
            onItemChange={val => _onFieldChange(record.rowId, 'type', val)}
          />
        );
      },
    };
    for (let i = 0; i < columns_number; i++) {
      const title = String.fromCharCode(i + charCodeInit);
      const col = {
        title: title,
        dataIndex: title,
        textAlign: 'center',
        width: 100,
        shouldCellUpdate: (record, prevRecord) => {
          return record[title] !== prevRecord[title];
        },
        render: (text, record, index) => {
          return (
            <InputFormItem
              formValue={text}
              isFirstRow={index === 0}
              isFirstCol={i === 0}
              onItemChange={val => _onFieldChange(record.rowId, title, val)}
            />
          );
        },
      };
      columnsArr.push(col);
    }
    columnsArr.push(rightColumn);
    return columnsArr;
  }, [_onFieldChange, compName]);

  return (
    <div className={styles.sheetContainer}>
      <ExcelDownloadHead
        handleDealExcelData={handleDealExcelData}
        handleDownloadExcel={handleDownloadExcel}
        handleExportExcel={handleExportExcel}
        hiddenAddBtn={true}
      />
      <Table
        className={classnames(styles.sheetTable)}
        pagination={false}
        columns={RenderColumns}
        dataSource={rowsData}
        rowKey="rowId"
        scroll={{ x: 1500, y: 500 }}
        bordered={true}
      />
    </div>
  );
}

ExcelMainContent.propTypes = {
  propsForm: PropTypes.object,
  data: PropTypes.object,
};

export default Form.create()(ExcelMainContent);

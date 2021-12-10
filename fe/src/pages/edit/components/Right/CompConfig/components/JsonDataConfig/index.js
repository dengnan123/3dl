import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Tabs, notification } from 'antd';

import { validateFunc } from '@/components/AceEditor/util';
import JsonConfig from '../JsonConfig';
import ExcelMainContent from '../ExcelMainContent';

import styles from './index.less';

const EchartType = ['Bar', 'Line', 'Pie', 'LineAndBar', 'CenterBar', 'RadarChart', 'ScatterPlot'];

const { TabPane } = Tabs;
function StaticDataConfig(props) {
  const { form, data, staticData } = props;
  const { compName, mockData } = data || {};
  const [activeKey, setActiveKey] = useState('JSON');
  const [excelData, setExcelData] = useState(mockData);

  const isShowExcel = EchartType.includes(compName);
  const mockDataString = JSON.stringify(mockData, null, 2);

  form.getFieldDecorator('mockData', {
    initialValue: mockDataString,
  });

  const initMockData = form.getFieldValue('mockData') || mockDataString;

  const onChangeTabs = key => {
    if (key === 'JSON') {
      setActiveKey(key);
      return;
    }
    const validateMsg = validateFunc('json', initMockData);
    if (validateMsg) {
      notification.open({
        message: 'Error',
        description: 'json格式错误，不能切换模式',
      });
      return;
    }
    const excelCurrentData = JSON.parse(initMockData);
    setActiveKey(key);
    setExcelData(excelCurrentData);
  };

  return (
    <div className={styles.container}>
      <div className={styles.right}>
        <Tabs activeKey={activeKey} onChange={onChangeTabs}>
          <TabPane tab="JSON模式" key="JSON">
            {activeKey === 'JSON' && (
              <JsonConfig
                form={form}
                data={data}
                staticData={staticData}
                initMockData={initMockData}
              />
            )}
          </TabPane>
          {isShowExcel && (
            <TabPane tab="Excel模式" key="EXCEL">
              <ExcelMainContent propsForm={form} data={data} initMockData={excelData} />
            </TabPane>
          )}
        </Tabs>
      </div>
    </div>
  );
}

StaticDataConfig.propTypes = {
  form: PropTypes.object,
  data: PropTypes.object,
  staticData: PropTypes.object,
};

export default StaticDataConfig;

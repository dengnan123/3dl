import { useState, Fragment } from 'react';
import { Form, Button, Divider, Drawer, Icon } from 'antd';
import styles from './index.less';
import Legend from '../../components/Legend';
import PieBasic from '../../components/PieBasic';
import Tooltip from '../../components/Tooltip';
import Title from '../../components/Title';
import Emphasis from '../../components/Emphasis';
import GraphColor from '../../components/GraphColor';
import EditECharts from '../../../../components/EditECharts';
import Toolbox from '../../components/Toolbox';

const EChartConfig = props => {
  const { style, formItemLayout, updateMockData, mockData: propsMockData, updateStyle } = props;

  const [vis, setVis] = useState(false);
  const [clickInfo, setClickInfo] = useState({});
  const onClose = () => {
    setVis(false);
  };
  const handleClick = v => {
    setClickInfo(v);
    setVis(true);
  };

  const arr = [
    {
      key: 'series',
      label: '基础设置',
      Comp: PieBasic,
    },
    {
      key: 'title',
      label: '标题设置',
      Comp: Title,
    },
    {
      key: 'emphasis',
      label: '高亮标签设置',
      Comp: Emphasis,
    },
    {
      key: 'tooltip',
      label: '提示设置Tooltip',
      Comp: Tooltip,
    },
    {
      key: 'legend',
      label: '图例设置legend',
      Comp: Legend,
    },
    {
      key: 'graphColor',
      label: '图表配色',
      Comp: GraphColor,
    },
    {
      key: 'Toolbox',
      label: '工具栏',
      Comp: Toolbox,
    },
  ];

  const compProps = {
    style,
    formItemLayout,
    updateMockData,
    mockData: propsMockData,
    updateStyle,
  };

  const { Comp, label } = clickInfo;
  return (
    <div className={styles.box}>
      <div className={styles.textDiv}>
        {arr.map(v => {
          const { key, label } = v;
          return (
            <div
              key={key}
              className={styles.item}
              onClick={() => {
                handleClick(v);
              }}
            >
              <p className={styles.title}>{label}</p>
              <div className={styles.icon}>
                <Icon type="edit" />
              </div>
            </div>
          );
        })}
      </div>
      <EditECharts {...props} />
      <Drawer
        width={400}
        title={label}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={vis}
      >
        {Comp && <Comp {...compProps} />}
      </Drawer>
    </div>
  );
};

export default Form.create()(EChartConfig);

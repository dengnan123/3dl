import { isArray } from 'lodash';
import styles from './index.less';

const getNewData = pData => {
  if (!pData || JSON.stringify(pData) === '{}') {
    return [];
  }
  if (!pData?.dataSource) {
    return [];
  }
  if (isArray(pData.dataSource)) {
    return pData.dataSource;
  }
  return [pData?.dataSource];
};

const DyContainer = props => {
  const { data, child, style } = props;
  const dataArr = getNewData(data);
  if (!child?.length) {
    return '请放入子组件';
  }
  const compData = child[0];
  if (!compData) {
    return '请放入子组件';
  }
  const { renderChildCompFunc } = compData;

  const { itemStyle, containerStyle } = style;

  return (
    <div style={containerStyle}>
      {dataArr.map((v, index) => {
        return (
          <div key={index} className={styles.item} style={itemStyle}>
            {renderChildCompFunc && renderChildCompFunc(v)}
          </div>
        );
      })}
    </div>
  );
};

export default DyContainer;

import React from 'react';
// import PropTypes from 'prop-types';
import { Slider } from 'antd';
import styles from './index.less';

export default ({ btnClick, setAuto, openAuto, setPer, percentageValue }) => {
  return (
    <div className={styles.canvasTools}>
      {/* <div>
        <Button type="link" size="small" onClick={btnClick}>
          隐藏参考线
        </Button>
      </div> */}
      {/* <div>
        <Button type="link" size="small">
          组件自动吸附:
        </Button>
        <Switch onChange={setAuto} value={openAuto}></Switch>
      </div> */}
      <div style={{ width: '200px' }}>
        {/* <span>面板缩放百分比:</span> */}
        <Slider value={percentageValue} min={20} onChange={setPer}></Slider>
      </div>
    </div>
  );
};

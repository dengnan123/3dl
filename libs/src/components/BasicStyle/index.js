import React from 'react';
import { Tooltip, Collapse } from 'antd';
import ItemStyle from '../ItemStyle';
// import styles from './index.less';

function BasicStyle(props) {
  // const {} = props;

  const tooptip = (a, b, c) => {
    return (
      <Tooltip placement={'top'} title={b}>
        <span>{a}</span>
      </Tooltip>
    );
  };

  return (
    <>
      <Collapse accordion>
        <Collapse.Panel header={tooptip('外边距', 'margin')}>
          <ItemStyle name="左外边距" stylename="marginLeft" />
          <ItemStyle name="右外边距" stylename="marginRight" />
          <ItemStyle name="上外边距" stylename="marginTop" />
          <ItemStyle name="下外边距" stylename="marginBottom" />
        </Collapse.Panel>

        <Collapse.Panel header={tooptip('内边距', 'padding')}>
          <ItemStyle name="左内边距" stylename="paddingLeft" />
          <ItemStyle name="右内边距" stylename="paddingRight" />
          <ItemStyle name="上内边距" stylename="paddingTop" />
          <ItemStyle name="下内边距" stylename="paddingBottom" />
        </Collapse.Panel>
      </Collapse>
    </>
  );
}

export default BasicStyle;

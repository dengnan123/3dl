import { useEffect, useRef } from 'react';
import { Progress } from 'antd';
import { v4 } from 'uuid';
import styles from './index.less';

const LineProgress = props => {
  const { data, style } = props;
  const { lineProgress = 0 } = data;
  const timeStamp = useRef(new Date().getTime());
  const dom_id = `progress-${timeStamp.current}`;
  const {
    strokeWidth,
    strokeColor,
    steps,
    trailColor,
    GloStrokeColor = false,
    StrokeColorForm,
    textColor,
    showInfo,
    StrokeColorTo,
    format = '%',
  } = style;
  let newStrokeColor = {};
  if (GloStrokeColor) {
    newStrokeColor = { '0%': StrokeColorForm || '#108ee9', '100%': StrokeColorTo || '#87d068' };
  }

  useEffect(() => {
    let dom = document.querySelectorAll(`#${dom_id} .ant-progress-inner`);

    if (dom && trailColor) {
      dom[0].style.backgroundColor = trailColor;
    }

    return () => {
      dom = null;
    };
  }, [dom_id, trailColor]);

  const id = v4();

  useEffect(() => {
    const node = document.getElementById(id);
    if (!node) return;
    const domNode = node.getElementsByClassName('ant-progress-text')[0];
    if (!domNode) return;

    domNode.style.color = textColor;
  }, [textColor]);

  return (
    <div id={id} className={styles.container}>
      <Progress
        id={dom_id}
        type="line"
        percent={lineProgress}
        steps={steps}
        showInfo={showInfo}
        strokeWidth={strokeWidth}
        strokeColor={GloStrokeColor ? newStrokeColor : strokeColor}
        trailColor={trailColor}
        format={(percent, successPercent) => {
          return percent + `${format}`;
        }}
        // {...style}
      />
    </div>
  );
};

export default LineProgress;

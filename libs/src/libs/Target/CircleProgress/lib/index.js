import { useEffect, useState } from 'react';
import { Progress } from 'antd';
import { v4 } from 'uuid';
import styles from './index.less';

const CircleProgress = props => {
  const [id] = useState(v4());
  const { height, data, style } = props;
  const { CircleProgress = 0 } = data;
  const {
    width,
    strokeWidth,
    strokeColor,
    trailColor,
    showInfo = true,
    textColor = 'rgba(0,0,0,.65)',
    fontSize,
    format = '%',
    SegmentStatus = false,
    Segment = [],
  } = style;

  const item =
    SegmentStatus && Segment.filter(k => CircleProgress >= k.min && CircleProgress < k.max);
  const color = item[0] ? item[0].color : strokeColor;

  const max = Math.max.apply(
    Math,
    Segment.map(i => i.max),
  );

  useEffect(() => {
    const node = document.getElementById(id);
    if (!node) return;
    const domNode = node.getElementsByClassName('ant-progress-text')[0];
    if (!domNode) return;

    domNode.style.color = textColor;
    if (fontSize) {
      domNode.style.fontSize = `${fontSize}px`;
    }
  }, [textColor, fontSize, id]);

  return (
    <div id={id} className={styles.container}>
      <Progress
        type="circle"
        width={width || height}
        percent={max && !!Segment?.length ? (CircleProgress / max) * 100 : CircleProgress} // 20201211-有最大值，计算当前占比取长度
        strokeWidth={strokeWidth}
        strokeColor={color}
        trailColor={trailColor}
        showInfo={showInfo}
        format={(percent, successPercent) => {
          return CircleProgress + `${format}`; // 20201211-这里是为了解决当percent > 100 最大只显示100
        }}
        // {...style}
      />
    </div>
  );
};

export default CircleProgress;

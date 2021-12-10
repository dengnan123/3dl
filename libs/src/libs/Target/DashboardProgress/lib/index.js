import { useEffect } from 'react';
import { v4 } from 'uuid';
import { Progress } from 'antd';

const DashboardProgress = props => {
  const { data, style, height } = props;
  const { dashboardProgress = 0 } = data;
  const {
    width,
    strokeWidth,
    strokeColor,
    trailColor,
    GloStrokeColor = false,
    StrokeColorForm,
    StrokeColorTo,
    format = '%',
    textColor = 'rgba(0,0,0,.65)',
    gapDegree,
    gapPosition,
  } = style;
  let newStrokeColor = {};
  if (GloStrokeColor) {
    newStrokeColor = { '0%': StrokeColorForm || '#108ee9', '100%': StrokeColorTo || '#87d068' };
  }

  const id = v4();

  useEffect(() => {
    const node = document.getElementById(id);
    if (!node) return;
    const domNode = node.getElementsByClassName('ant-progress-text')[0];
    if (!domNode) return;

    domNode.style.color = textColor;
  }, [textColor,id]);

  return (
    <div id={id}>
      <Progress
        type="dashboard"
        width={width || height}
        percent={dashboardProgress}
        strokeWidth={strokeWidth}
        gapDegree={gapDegree}
        gapPosition={gapPosition}
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

export default DashboardProgress;

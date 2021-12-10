import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'dayjs';

import { useCompare } from '../../../helpers/hook';

import styles from './index.less';

function Clock(props) {
  const { data = {}, style = {}, width: devWidth, height: devHeight } = useCompare(props, 'object');
  const { dataSource } = data;

  const finalStyle = useCompare(style, 'object');

  const {
    clockCircleBgColor = '#0f1522',
    clockSrc = '',
    clockCircleBgSize,
    showNumber = true,
    fontSize = 20,
    fontColor = '#ccc',
    showTimeStick = true,
    timeStickColor = '#ccc',
    currentTimePointType = 'currentTime',
    currentTimePointSize = 24,
    currentTimePointColor = '#ffffff',
    currentTimePointShadow = true,
    showMeeting = true,
    lineWidth = 14,
    highlightLineWidth = 18,
  } = finalStyle;

  const finalDataSource = useMemo(() => {
    return (dataSource || []).sort((a, b) => b.startTime - a.startTime);
  }, [dataSource]);

  // 计算表盘数据
  const { width, centerX, centerY, radius, timeLineRadius, clockBgSize } = useMemo(() => {
    const width = Math.min(devWidth, devHeight);
    const maxLineWidth = Math.max(lineWidth, highlightLineWidth, currentTimePointSize + 10);
    const radius = (width - maxLineWidth) / 2;
    const timeLineRadius = (width - Math.max(lineWidth, highlightLineWidth) * 2) / 2 - 6;
    const centerX = width / 2;
    const centerY = centerX;
    const clockBgSize = [undefined, null].includes(clockCircleBgSize) ? width : clockCircleBgSize;
    return { width, centerX, centerY, radius, timeLineRadius, clockBgSize };
  }, [devWidth, devHeight, highlightLineWidth, lineWidth, currentTimePointSize, clockCircleBgSize]);

  useEffect(() => {
    let clock = setInterval(
      () => {
        const myCanvas = document.getElementById('clock-canvas');

        if (!myCanvas) {
          return;
        }

        const ctx = myCanvas.getContext('2d');

        ctx.clearRect(0, 0, width, width);

        const currentTime = moment().valueOf();
        const totalTime = 12 * 60 * 60;
        const startDayTime = moment()
          .startOf('day')
          .valueOf();

        // 画时钟表盘
        !clockSrc &&
          drawCircle({
            ctx,
            centerX,
            centerY,
            radius,
            lineWidth,
            strokeColor: clockCircleBgColor,
          });
        showNumber &&
          drawNumber({
            ctx,
            centerX,
            centerY,
            radius: timeLineRadius,
            lineWidth,
            fontSize,
            fontColor,
          });
        showTimeStick &&
          drawTimeStick({
            ctx,
            centerX,
            centerY,
            radius: timeLineRadius,
            lineWidth,
            lineColor: timeStickColor,
          });

        if (showMeeting) {
          for (let item of finalDataSource) {
            const { startTime, endTime, color } = item;
            const active = startTime <= currentTime && endTime >= currentTime;
            const currentLineWidth = !active ? lineWidth : highlightLineWidth;
            const strokeColor = color || '#0000ff';

            let currentStartTime = startTime;
            if (startTime <= currentTime && endTime >= currentTime) {
              currentStartTime = currentTime;
            }
            const start = ((currentStartTime - startDayTime) / 1000) % totalTime;
            const end = ((endTime - startDayTime) / 1000) % totalTime;

            // const angleDiff = Math.atan(currentLineWidth / 2 / (radius - currentLineWidth / 2));
            const angleDiff = 0;
            const startAngle = (start / totalTime) * 2 * Math.PI - Math.PI / 2 + angleDiff;
            const endAngle = (end / totalTime) * 2 * Math.PI - Math.PI / 2 - angleDiff;

            // 画弧形
            drawArc({
              ctx,
              centerX,
              centerY,
              startAngle,
              endAngle,
              radius,
              lineWidth: currentLineWidth,
              strokeColor,
            });
          }
        }
        // 画当前时间点
        currentTimePointType === 'currentTime'
          ? drawTimePoint({
              ctx,
              centerX,
              centerY,
              radius,
              pointSize: currentTimePointSize,
              strokeColor: currentTimePointColor,
              showShadow: currentTimePointShadow,
            })
          : drawSecondPoint({
              ctx,
              centerX,
              centerY,
              radius,
              pointSize: currentTimePointSize,
              strokeColor: currentTimePointColor,
              showShadow: currentTimePointShadow,
            });
      },
      currentTimePointType === 'currentTime' ? 1000 : 50,
    );

    return () => {
      clearInterval(clock);
      clock = null;
    };
  }, [
    centerX,
    centerY,
    clockCircleBgColor,
    finalDataSource,
    highlightLineWidth,
    lineWidth,
    radius,
    width,
    fontSize,
    fontColor,
    timeStickColor,
    currentTimePointSize,
    currentTimePointColor,
    currentTimePointShadow,
    timeLineRadius,
    showMeeting,
    showNumber,
    showTimeStick,
    currentTimePointType,
    clockSrc,
  ]);

  return (
    <div className={styles.container}>
      <canvas
        width={width}
        height={width}
        style={{
          width,
          height: width,
          backgroundImage: `url(${clockSrc})`,
          backgroundSize: `${clockBgSize}px ${clockBgSize}px`,
        }}
        className={styles.canvas}
        id="clock-canvas"
      />
    </div>
  );
}

Clock.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  style: PropTypes.object,
  data: PropTypes.object,
};

export default Clock;

function drawCircle({ ctx, centerX, centerY, radius, lineWidth, strokeColor }) {
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = strokeColor;
  ctx.stroke();
}

function drawNumber({ ctx, centerX, centerY, radius, lineWidth, fontSize, fontColor = '#999' }) {
  ctx.beginPath();
  ctx.font = `${fontSize}px normal`;
  ctx.fillStyle = fontColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let n = 1; n <= 12; n++) {
    const theta = ((n - 3) * (Math.PI * 2)) / 12;
    const _r = radius - 70 - (fontSize - 20) / 2;
    const x = _r * Math.cos(theta) + centerX;
    const y = _r * Math.sin(theta) + centerY;
    ctx.fillText(n, x, y);
  }
}

function drawTimeStick({ ctx, centerX, centerY, radius, lineWidth, lineColor = '#ccc' }) {
  for (let n = 1; n <= 24; n++) {
    const theta = ((n - 3) * (Math.PI * 2)) / 24;
    const startLineRadius = n % 2 === 1 ? radius - 50 : radius - 40;
    const endLineRadius = radius - 10;
    const startX = startLineRadius * Math.cos(theta) + centerX;
    const startY = startLineRadius * Math.sin(theta) + centerY;
    const endX = endLineRadius * Math.cos(theta) + centerX;
    const endY = endLineRadius * Math.sin(theta) + centerY;
    ctx.beginPath();
    ctx.strokeStyle = lineColor;
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.lineWidth = n % 2 === 1 ? 4 : 2;
    ctx.lineCap = 'round';
    ctx.stroke();
  }
}

function drawArc({
  ctx,
  centerX,
  centerY,
  startAngle,
  endAngle,
  radius,
  lineWidth,
  strokeColor,
  lineCap = 'round',
}) {
  ctx.save();
  ctx.beginPath();
  ctx.lineWidth = lineWidth;
  ctx.lineCap = lineCap;
  ctx.strokeStyle = strokeColor;
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.stroke();
  ctx.restore();
}

function drawTimePoint({ ctx, centerX, centerY, radius, pointSize, strokeColor, showShadow }) {
  const currentTime = moment().valueOf();
  const startDayTime = moment()
    .startOf('day')
    .valueOf();
  const totalTime = 12 * 60 * 60;
  const start = ((currentTime - startDayTime) / 1000) % totalTime;

  const startAngle = (start / totalTime) * 2 * Math.PI - Math.PI / 2;

  const startX = centerX + radius * Math.cos(startAngle);
  const startY = centerY + radius * Math.sin(startAngle);
  ctx.save();
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = strokeColor;
  if (showShadow) {
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#FB712B';
  }

  ctx.arc(startX, startY, pointSize / 2, 0, 2 * Math.PI);
  ctx.fillStyle = strokeColor;
  ctx.fill();
  ctx.restore();
}

function drawSecondPoint({ ctx, centerX, centerY, radius, pointSize, strokeColor, showShadow }) {
  const currentMillisecond = moment().millisecond() + moment().second() * 1000;

  const total = 60 * 1000;
  const start = currentMillisecond % total;

  const startAngle = (start / total) * 2 * Math.PI - Math.PI / 2;

  const startX = centerX + radius * Math.cos(startAngle);
  const startY = centerY + radius * Math.sin(startAngle);
  ctx.save();
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = strokeColor;
  if (showShadow) {
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#FB712B';
  }
  ctx.arc(startX, startY, pointSize / 2, 0, 2 * Math.PI);
  ctx.fillStyle = strokeColor;
  ctx.fill();
  ctx.restore();
}

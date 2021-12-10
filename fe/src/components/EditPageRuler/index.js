import { useEffect, useCallback, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import classnames from 'classnames';
import { Icon } from 'antd';

import { drawRules, getElementToPageTop, getElementToPageLeft } from './utils';
import styles from './index.less';

function EditPageRuler(props) {
  const { width, height, itemHeight = 16, scale, config } = props;
  const scaleRef = useRef(scale);
  const { lineColor } = config;
  const [moveType, setType] = useState(null);
  const [moveId, setId] = useState(null);
  const [isLineShow, setLineShow] = useState(true);
  const [lineList, setLineList] = useState([]);

  useEffect(() => {
    drawRules('canvasTop', { ruleWidth: width, itemHeight, scale });
    drawRules('canvasLeft', { ruleWidth: height, itemHeight, scale });
  }, [width, height, itemHeight, scale]);

  useEffect(() => {
    setLineList(list => {
      return list.map(n => {
        const { type, left, top } = n;

        const currentScale = scaleRef.current;
        if (type === 'horizontal') {
          const currentTop = top - itemHeight;
          const newTop = (currentTop / currentScale) * scale;
          const finalTop = newTop + itemHeight;
          return { ...n, top: finalTop };
        }
        const currentLeft = left - itemHeight;
        const newLeft = (currentLeft / currentScale) * scale;
        const finalLeft = newLeft + itemHeight;
        return { ...n, left: finalLeft };
      });
    });
    scaleRef.current = scale;
  }, [scale, itemHeight, setLineList]);

  /** 辅助线移动 **/
  const onCanvasMouseMove = useCallback(
    (e, type) => {
      let wrapperNode = undefined;
      let canvasTopValue = 0;
      let canvasLeftValue = 0;
      let finalTop = 0;
      let finalLeft = 0;
      if (!moveId) return;
      wrapperNode = document.getElementById('canvasWrapper');
      if (!wrapperNode) return;

      if (moveType === 'horizontal') {
        canvasTopValue = getElementToPageTop(wrapperNode);
        finalTop = e.clientY - canvasTopValue - itemHeight;
        finalTop = finalTop + itemHeight;
      } else {
        canvasLeftValue = getElementToPageLeft(wrapperNode);
        finalLeft = e.clientX - canvasLeftValue - itemHeight;
        finalLeft = finalLeft + itemHeight;
      }

      const finalLineList = lineList.map(n => {
        if (n.id !== moveId) {
          return n;
        }
        if (moveType === 'horizontal') {
          n.top = finalTop;
          return n;
        }
        n.left = finalLeft;
        return n;
      });

      setLineList(finalLineList);
    },
    [moveId, moveType, itemHeight, lineList],
  );

  /** 辅助线移动结束 **/
  const onCanvasMouseUp = useCallback(() => {
    if (!moveId && !moveType) return;
    setId(null);
    setType(null);
  }, [moveId, moveType]);

  useEffect(() => {
    document.addEventListener('mousemove', onCanvasMouseMove);
    document.addEventListener('mouseup', onCanvasMouseUp);
    return () => {
      document.removeEventListener('mousemove', onCanvasMouseMove);
      document.removeEventListener('mouseup', onCanvasMouseUp);
    };
  }, [onCanvasMouseMove, onCanvasMouseUp]);

  /** 辅助线点击 **/
  const onLineMouseDown = useCallback((currentId, currentType) => {
    setId(currentId);
    setType(currentType);
  }, []);

  /** Canvas点击拖拽辅助线 **/
  const onCanvasMouseDown = useCallback(
    type => {
      if (!isLineShow) return;
      const lineId = uuid();
      const currentLine = {
        id: lineId,
        type,
        left: type === 'horizontal' ? 0 : itemHeight,
        top: type === 'horizontal' ? itemHeight : 0,
      };
      setLineList(list => [...list, currentLine]);
      setId(lineId);
      setType(type);
    },
    [lineList, itemHeight, isLineShow],
  );

  /** 隐藏所有辅助线 **/
  const onClearLines = useCallback(() => {
    setLineShow(show => !show);
  }, []);

  /** 删除辅助线 */
  const deleteLine = useCallback(
    lineId => {
      setLineList(list => list.filter(n => n.id !== lineId));
    },
    [lineList],
  );

  const canvasWidth = width * scale;
  const canvasHeight = height * scale;

  return (
    <div className={styles.wrapper} id="canvasWrapper">
      <canvas
        id="canvasTop"
        width={canvasWidth}
        height={itemHeight}
        style={{
          left: itemHeight,
          top: 0,
          cursor: 'ns-resize',
        }}
        onMouseDown={e => {
          onCanvasMouseDown('horizontal');
        }}
        onMouseUp={() => {
          onCanvasMouseUp('horizontal');
        }}
      />
      <canvas
        id="canvasLeft"
        width={canvasHeight}
        height={itemHeight}
        style={{
          top: 0,
          left: 0,
          cursor: 'ew-resize',
          transform: 'rotate(90deg)',
          transformOrigin: '0% 100%',
        }}
        onMouseDown={e => {
          onCanvasMouseDown('vertical');
        }}
        onMouseUp={() => {
          onCanvasMouseUp('vertical');
        }}
      />
      <div
        className={styles.clearIcon}
        onClick={onClearLines}
        style={{
          width: itemHeight,
          height: itemHeight,
          lineHeight: `${itemHeight}px`,
        }}
      >
        <Icon
          type="pushpin"
          style={{
            color: isLineShow ? '#1991eb' : '#9B9B9B',
          }}
        />
      </div>
      {/* 参考线 */}
      {isLineShow &&
        lineList?.map(n => {
          const { id, type, left, top } = n;
          const active = id === moveId;
          const text =
            type === 'horizontal'
              ? `Y：${Math.round((top - itemHeight) / scale)}px`
              : `X：${Math.round((left - itemHeight) / scale)}px`;
          return (
            <div
              key={id}
              className={classnames(
                styles['rule-line'],
                type === 'horizontal' ? styles['rule_hor'] : styles['rule_ver'],
              )}
              style={{
                backgroundColor: lineColor,
                borderColor: lineColor,
                color: lineColor,
                left,
                top,
              }}
              onMouseDown={e => onLineMouseDown(id, type)}
              onMouseUp={onCanvasMouseUp}
              onDoubleClick={() => deleteLine(id)}
            >
              {active && (
                <div
                  className={styles.position_content}
                  style={{ color: lineColor, borderColor: lineColor }}
                >
                  {text}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}

EditPageRuler.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  itemHeight: PropTypes.number,
  scale: PropTypes.number,
  config: PropTypes.object,
};

export default EditPageRuler;

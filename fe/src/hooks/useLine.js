import { useState, useEffect } from 'react';

export const useLine = mulArr => {
  const [clickId, setClickId] = useState();
  const [mulIdArr, setmulArrId] = useState([]);

  useEffect(() => {
    const mulIdArr = mulArr.map(v => v.id);
    setmulArrId(mulIdArr);
  }, [mulArr]);

  const _setClickId = id => {
    setClickId(oldId => {
      // 先清除上一次点击的ID
      if (oldId !== id) {
        hiddenLine(oldId);
      }
      drawLine(id);
      return id;
    });
  };

  const _setmulArrId = id => {
    setmulArrId(v => {
      if (v.includes(id)) {
        // 说明多选 又取消了选中
        hiddenLine(id);
        return v.filter(item => item !== id);
      }
      drawLine(id);
      return [...v, id];
    });
  };

  const clearLine = () => {
    setmulArrId(old => {
      for (const id of old) {
        hiddenLine(id);
      }
      setmulArrId([]);
    });
    hiddenLine(clickId);
  };

  return {
    setClickIdForLine: _setClickId,
    setmulArrIdForLine: _setmulArrId,
    mulIdArrForLine: mulIdArr,
    clearLine,
  };
};

/**
 * 绘制参考线
 */
export const drawLine = id => {
  if (!id) {
    return;
  }
  const line = document.getElementById(`${id}_line`);
  if (line) {
    line.style.transform = 'scale(1)';
  }
};

/**
 * 隐藏参考线
 */
export const hiddenLine = id => {
  if (!id) {
    return;
  }
  const line = document.getElementById(`${id}_line`);
  if (line) {
    line.style.transform = 'scale(0)';
  }
};

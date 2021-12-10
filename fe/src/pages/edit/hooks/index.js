import { useEffect, useState } from 'react';

import { getElementPagePosition } from '../../../helpers/utils';
import { useSize } from '@umijs/hooks';
// import { add } from 'echarts-gl';

const useElementPagePosition = id => {
  const [postion, setPos] = useState({});
  useEffect(() => {
    const ele = document.getElementById(id);
    if (ele) {
      const data = getElementPagePosition(ele);
      setPos(data);
    }
  }, [id, setPos]);

  return postion;
};

const useGetTopAndLeftData = arr => {
  const [topData, setTop] = useState({});
  const [leftData, setLeft] = useState({});

  useEffect(() => {
    let topData = {};
    let leftData = {};

    for (const item of arr) {
      const { left, top, id } = item;
      const xValue = leftData[left];
      const yValue = topData[top];
      if (!xValue) {
        leftData[left] = [id];
      } else {
        leftData[left] = [...leftData[left], id];
      }
      if (!yValue) {
        topData[top] = [id];
      } else {
        topData[top] = [...topData[top], id];
      }
    }

    setTop(topData);
    setLeft(leftData);
  }, [arr, setTop, setLeft]);
  return {
    topData,
    leftData,
  };
};

const useGetWidthAndHeight = (pageWidth, pageHeight) => {
  // 大屏宽高变动重新设置百分比
  const [{ canvasWidth, canvasHeight }, setState] = useState({});
  const [percentageValue, setPer] = useState(0);
  const [state] = useSize(document.querySelector('body'));

  useEffect(() => {
    const canvasWidth = state.width - 250 - 250 - 30 - 30;
    const percentage = (canvasWidth / pageWidth).toFixed(2);
    const percentageValue = percentage * 100;
    setPer(percentageValue);
  }, [state, setState, setPer, pageHeight, pageWidth]);

  return [
    {
      canvasWidth,
      canvasHeight,
      percentageValue,
    },
    setPer,
  ];
};

export { useElementPagePosition, useGetTopAndLeftData, useGetWidthAndHeight };

// export const useEditModal = ({ modalType }) => {
//   const modalProps = {
//     CodeEdit: <CodeEdit {...codeEditProps}></CodeEdit>,
//     ScreenList: <ScreenList {...screenListProps}></ScreenList>,
//     SaveThemeConfig: <SaveThemeConfig {...saveThemeConfigProps}></SaveThemeConfig>,
//   };

//   return {
//     modalConfirmLoading:'',
//     renderContent:'',

//   }
// };

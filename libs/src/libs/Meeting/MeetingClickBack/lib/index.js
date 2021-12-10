import { useEffect, useState, useRef } from 'react';
import { openSystemManagement } from '../../../../hooks/meeting';

const MeetingClickBack = ({ style = {} }) => {
  const { time } = style;
  const timeRef = useRef();
  const [clickNum, setNum] = useState(0);
  useEffect(() => {
    // 监听点击事件 连续点击10次 就回到管理页面
    let _time = time;
    if (!_time) {
      _time = 60;
    }
    const timeId = setInterval(() => {
      // 定时 60 清零
      setNum(0);
    }, 1000 * _time);
    timeRef.current = timeId;
    return () => {
      clearInterval(timeRef.current);
    };
  }, [setNum, time]);

  useEffect(() => {
    if (clickNum < 10) {
      return;
    }
    // 回到维修页面
    openSystemManagement();
    //  清零
    setNum(0);
  }, [clickNum]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
      }}
      onClick={() => {
        setNum(pre => {
          return pre + 1;
        });
      }}
    ></div>
  );
};

export default MeetingClickBack;

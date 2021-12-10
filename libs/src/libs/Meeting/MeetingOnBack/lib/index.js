import { useEffect, useCallback } from 'react';
import { onBackCallBack } from '../../../../hooks/meeting';
const MeetingOnBack = ({ onChange }) => {
  const callback = useCallback(
    res => {
      // 回到了web页面,需要刷新列表
      onChange &&
        onChange({
          includeEvents: ['fetchApi'],
        });
    },
    [onChange],
  );

  useEffect(() => {
    onBackCallBack(callback);
  }, [callback]);
  return <div></div>;
};

export default MeetingOnBack;

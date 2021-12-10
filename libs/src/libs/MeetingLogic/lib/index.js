import React, { useEffect, useMemo } from 'react';
import { debounce } from 'lodash';

function MeetingLogic(props) {
  const { style = {} } = props;

  const { duration = 60000 } = style || {};

  useEffect(() => {
    const handleTouchEvent = _ => {
      localStorage.removeItem('localUser');
    };
    document.body.addEventListener(
      'touchend',
      debounce(handleTouchEvent, duration, {
        leading: true,
        trailing: false,
      }),
    );

    return () => {
      document.body.removeEventListener('touchend', handleTouchEvent);
    };
  }, [duration]);
  return useMemo(() => <></>, [duration]);
}

export default MeetingLogic;

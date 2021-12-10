import { useEffect, useRef, useCallback } from 'react';
import moment from 'moment';
const defaultTime = [{ hour: 0, min: 0, sec: 0 }];
function ReloadProject(props) {
  const {
    style: { openReload, reload = defaultTime },
  } = props;
  const timer = useRef();

  console.log('ReloadProject', props.style);
  const reloadPage = useCallback(() => {
    if (openReload && Array.isArray(reload)) {
      timer.current && clearInterval(timer.current);
      timer.current = setInterval(() => {
        console.log('openReload state-<>-', openReload, `reload time at ${JSON.stringify(reload)}`);
        for (let i = 0; i < reload.length; i++) {
          const { hour = 0, min = 0, sec = 0 } = reload[i];
          const nowHour = moment().hour();
          const nowMin = moment().minute();
          const nowSec = moment().second();

          if (Number(hour) === nowHour && Number(min) === nowMin && Number(sec) === nowSec) {
            console.log('reload is invoked');
            window.location.reload();
          }
        }
      }, 1000);
    } else {
      console.log('reload is closed');
      clearInterval(timer.current);
    }
  }, [openReload, reload]);

  useEffect(() => {
    reloadPage();
    return () => {
      clearInterval(timer.current);
    };
  }, [reloadPage]);

  return null;
}

export default ReloadProject;

// function isHasValue(value) {
//   return (
//     Object.prototype.toString.call(value) !== '[object Null]' &&
//     Object.prototype.toString.call(value) !== '[object Undefined]'
//   );
// }

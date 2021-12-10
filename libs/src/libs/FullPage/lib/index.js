import screenfull from 'screenfull';
import { Button } from 'antd';

const getRender = style => {
  if (style.src) {
    return <img src={style.src} alt=""></img>;
  }
  return <Button type="primary">全屏</Button>;
};

const FullPage = ({ data, style = {} }) => {
  let element = document.getElementById('root');
  if (element.msRequestFullscreen) {
    element = document.body; //overwrite the element (for IE)
  }

  const getreqfullscreen = () => {
    if (screenfull.isEnabled) {
      screenfull.request(element);
    }
  };

  return <div onClick={getreqfullscreen}>{getRender(style)}</div>;
};

export default FullPage;

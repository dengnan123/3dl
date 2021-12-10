// import { Spin, Button } from 'antd';
import LoadingGif from '../../../assets/loading.svg';

import { useDeepCompareEffect } from 'react-use';
import Portal from '../../../components/Portal';

import styles from './index.less';

const Loading = props => {
  const {
    isHidden,
    style,
    onChange,
    loadingOverRes,
    getContainer,
    setLoadingOver,
    data = {},
  } = props;

  useDeepCompareEffect(() => {
    if (loadingOverRes && !isHidden) {
      onChange &&
        onChange({
          // includeEvents: ['showComps', 'hiddenComps', 'fetchApi'],
          loadingOverRes,
        });
    }
    return () => {
      // loading隐藏的时候  销毁loadingOverRes
      if (loadingOverRes) {
        setLoadingOver && setLoadingOver(null);
      }
    };
  }, [loadingOverRes, onChange, isHidden]);

  console.log('Loading ---- isHidden', isHidden);

  if (isHidden) {
    return null;
  }

  const getRender = () => {
    if (data.src || style.src) {
      return <img src={data.src || style.src} alt="loading"></img>;
    }
    return (
      <div>
        <img src={LoadingGif} alt="loading"></img>
      </div>
    );
  };

  return (
    <Portal getContainer={getContainer}>
      <div className={styles.modal}>{getRender()}</div>
    </Portal>
  );
};

export default Loading;

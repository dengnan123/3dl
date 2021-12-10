import LoadingGif from '../../../assets/loading.svg';
import { useDeepCompareEffect, useCustomCompareEffect } from 'react-use';
import { useEffect } from 'react';
import isEqual from 'fast-deep-equal';
import styles from './index.less';

const Loading = props => {
  const { style, onChange, loadingOverRes, setLoadingOver, data = {}, loading, id } = props;
  //
  useCustomCompareEffect(
    () => {
      // if (loadingOverRes) {
      //   console.log('loadingOverRes>>>>>', loadingOverRes);
      //   onChange &&
      //     onChange({
      //       loadingOverRes,
      //     });
      // }
      return () => {
        // loading隐藏的时候  销毁loadingOverRes
        if (loadingOverRes) {
          setLoadingOver && setLoadingOver(null);
        }
      };
    },
    [loadingOverRes, onChange, setLoadingOver],
    (prevDeps, nextDeps) => {
      const preProps = prevDeps[0];
      const nextProps = nextDeps[0];
      return isEqual(preProps, nextProps);
    },
  );

  useCustomCompareEffect(
    () => {
      // if (loading) {
      //   return;
      // }
      // window.doCustomAction &&
      //   window.doCustomAction({
      //     hiddenComps: [id],
      //   });
      if (loading === false) {
        console.log('loading over>>>>>>>>>>to  change');
        onChange &&
          onChange({
            loadingOverRes,
          });
      }
    },
    [loading],
    (prevDeps, nextDeps) => {
      const preProps = prevDeps[0];
      const nextProps = nextDeps[0];
      return isEqual(preProps, nextProps);
    },
  );

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
  return <div className={styles.modal}>{getRender()}</div>;
};

export default Loading;

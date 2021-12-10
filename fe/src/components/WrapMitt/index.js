import { useMemo } from 'react';
import { useMemoData } from './hooks';
import { LoadingBox } from '@/components';

const WrapMitt = Comp => {
  return function useName(props) {
    const memoData = useMemoData(props);
    const render = useMemo(() => {
      const onChange = params => {
        memoData.onChange &&
          memoData.onChange({
            ...memoData,
            params: {
              ...params,
              compName: memoData.compName,
            },
          });
      };
      const newProps = {
        ...memoData,
        onChange,
      };

      const loadingProps = {
        loading: memoData?.basicStyle?.showLoading && memoData?.loading,
      };

      return (
        <>
          <LoadingBox {...loadingProps} />
          <Comp {...newProps}></Comp>
        </>
      );
    }, [memoData]);
    return render;
  };
};

export default WrapMitt;

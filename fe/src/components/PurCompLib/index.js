import UmdLoader from '@/components/UmdLoader';
import ErrorWrap from '@/components/ErrorWrap';
import WrapMitt from '@/components/WrapMitt';
import { getCompScriptInfo } from '@/helpers/static';

const PurCompLib = props => {
  const { compName } = props;
  const { compLibSrc, loaderLibName } = getCompScriptInfo(compName);
  const umdLoaderProps = {
    ...props,
    url: compLibSrc,
    name: loaderLibName,
  };
  if (compName === 'Loading') {
    return (
      <UmdLoader {...umdLoaderProps}>
        <div></div>
      </UmdLoader>
    );
  }
  return (
    <ErrorWrap>
      <UmdLoader {...umdLoaderProps}>
        <div></div>
      </UmdLoader>
    </ErrorWrap>
  );
};

export default WrapMitt(PurCompLib);

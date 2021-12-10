import React from 'react';
import { getBasicStyle } from '@/helpers/utils';
import { getCompLib, getCompItemProps, generateDivId, getCompIsHidden } from '@/helpers/screen';
import classnames from 'classnames';
import styles from './index.less';
import CompRender from '@/components/CompRender';

const getEle = props => {
  const { v, onClick, authDataSource } = props;
  const { left, top, width, height, id, zIndex, child } = v;
  const newProps = {
    ...props,
    isPreview: true,
  };
  const _itemProps = getCompItemProps(newProps);
  const { otherCompParams } = _itemProps;
  const newIsHidden = getCompIsHidden({ v, authDataSource, otherCompParams });

  const renderComp = () => {
    if (!child?.length) {
      return getCompLib(_itemProps);
    }
    return <CompRender {...newProps}></CompRender>;
  };

  const getNewSty = () => {
    if (v.compName === 'Loading' && !newIsHidden) {
      return {
        zIndex: 9999,
        width: '100vw',
        height: '100vh',
      };
    }
    return {};
  };
  return (
    <div
      id={generateDivId(v)}
      key={id}
      style={{
        zIndex,
        left,
        top,
        width,
        height,
        position: 'absolute',
        ...getNewSty(),
        ...getBasicStyle(_itemProps),
      }}
      className={classnames(styles.rnd, newIsHidden ? styles.hidden : styles.show)}
      onClick={() => {
        onClick && onClick(v);
      }}
    >
      {renderComp()}
    </div>
  );
};
export default getEle;

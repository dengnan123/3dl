// import { useEffect, useState, Fragment, useRef } from 'react';

import { isArray, isObject } from 'lodash';
// import { getParseSearch } from '../../../../helpers/utils';
import Portal from '../../../../components/Portal';
import classnames from 'classnames';
import styles from './index.less';
import { useState, useEffect, useCallback } from 'react';
import { restartAppFunc } from '../../../../hooks/meeting';

const MeetingTheme = ({ isHidden, data, getContainer, onChange }) => {
  const [comp, setComp] = useState(null);

  const getRender = useCallback(() => {
    if (!isObject(data)) {
      return;
    }
    if (!isArray(data.themes)) {
      return;
    }

    return data.themes.map((v, index) => {
      return (
        <div className={classnames(styles.item)} key={index}>
          <div>
            <img
              src={v.imgSrc}
              alt=""
              onClick={() => {
                onChange({
                  includeEvents: ['fetchApi'],
                  ...v,
                });
                setTimeout(() => {
                  restartAppFunc();
                }, 100);
              }}
            ></img>
          </div>
        </div>
      );
    });
  }, [data, onChange]);

  useEffect(() => {
    const comp = getRender();
    setComp(comp);
  }, [getRender]);

  const onClose = () => {
    onChange({
      includeEvents: ['hiddenComps'],
    });
  };

  if (isHidden) {
    return null;
  }
  return (
    <Portal getContainer={getContainer}>
      <div
        className={styles.modal}
        style={{
          backgroundColor: 'rgba(66, 66, 66, 0.85)',
        }}
        onClick={onClose}
      >
        <div className={classnames(styles.content)}>{comp}</div>
      </div>
    </Portal>
  );
};

export default MeetingTheme;

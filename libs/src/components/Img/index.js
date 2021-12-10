import React, { useMemo, useRef, useCallback } from 'react';
import defPic from '@/assets/defPic.gif';
const Img = props => {
  const { className: styles, url, defImg } = props;
  const inputEl = useRef(null);
  const def = defImg ? defImg : defPic;
  const onError = useCallback(() => {
    inputEl.current.src = def;
  }, [def]);
  const imgDiv = useMemo(() => {
    return (
      <div className={styles}>
        <img alt="example" src={url} ref={inputEl} onError={onError}></img>
      </div>
    );
  }, [styles, url, onError]);

  return imgDiv;
};

export default Img;

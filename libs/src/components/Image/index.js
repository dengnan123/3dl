import React, { useMemo, useRef } from 'react';
import defPic from '@/assets/defPic.gif';
const Image = props => {
  const { style = {}, height, width } = props;
  const inputEl = useRef(null);
  const def = style.src ? style.src : defPic;

  const styleProps = {
    ...style,
    height,
    width,
  };
    const imgDiv = useMemo(() => {
      return (
        <div
          alt=""
          ref={inputEl}
          style={{
            //   width: width || 300,
            //   height: height || 300,
            background: `url(${def}) 0px 0px / 100% 100%`,
            ...styleProps,
          }}
        ></div>
      );
    }, [def, styleProps]);

    return imgDiv;

//   console.log('defdef', def);

//   //   console.log('inputEl',inputEl.current)

//   //   const sty = window.getComputedStyle(inputEl.current, null);
//   //   console.log('stystysty', sty);

//   return (
//     <div
//       ref={inputEl}
//       style={{
//         background: `url(${def}) 0px 0px / 100% 100%`,
//         ...styleProps,
//       }}
//     ></div>
//   );
};

export default Image;

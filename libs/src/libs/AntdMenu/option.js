import { useRef, useEffect, useState } from 'react';

/**
 * style 取值
 * @param {object} propsStyle
 */
export function useStyle(propsStyle) {
  const styleRef = useRef();
  const [style, setStyle] = useState();

  useEffect(() => {
    if (!styleRef.current || JSON.stringify(styleRef.current) !== JSON.stringify(propsStyle)) {
      styleRef.current = propsStyle;
      setStyle(propsStyle);
    }
  }, [propsStyle]);

  const compKey = style?.compKey ?? 'menu';

  return {
    ...style,
    compKey,
  };
}

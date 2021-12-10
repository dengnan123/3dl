import React, { useState, useEffect, useCallback, useRef } from 'react';
import emitter from '@/helpers/mitt';

export const useSelection = ({ id, isHidden, isLocking }) => {
  const [showSelectionline, setState] = useState(false);
  useEffect(() => {
    emitter.on(`${id}_selection_show`, v => {
      if (isHidden) {
        return;
      }
      if (isLocking) {
        return;
      }
      setState(true);
    });
    emitter.on(`${id}_selection_hidden`, v => {
      setState(false);
    });
    return () => {
      emitter.off(`${id}_selection`);
    };
  }, [id, isHidden, isLocking]);

  return showSelectionline;
};

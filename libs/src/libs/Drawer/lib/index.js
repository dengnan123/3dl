import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import styles from './index.less';

function useDrawerStatus() {
  const [drawerExpanded, setDrawerExpanded] = useState(false);
  const currentYRef = useRef(0);
  const { current: onMoveStart } = useRef(event => {
    currentYRef.current = event.clientY;
  });
  const { current: onMoveEnd } = useRef(event => {
    const currentY = event.clientY;
    setDrawerExpanded(currentY < currentYRef.current);
    currentYRef.current = 0;
  });
  const { current: onMoveCancel } = useRef(event => {
    currentYRef.current = 0;
  });
  return [onMoveStart, onMoveEnd, onMoveCancel, drawerExpanded, setDrawerExpanded];
}

function Drawer(props) {
  const { initialHeight, fullHeight, expanded, placeholder, children } = props;
  const [
    onMoveStart,
    onMoveEnd,
    onMoveCancel,
    drawerExpanded,
    setDrawerExpanded,
  ] = useDrawerStatus();
  useEffect(() => {
    setDrawerExpanded(expanded);
  }, [expanded, setDrawerExpanded]);
  const { current: onHideDrawer } = useRef(event => {
    if (event.target.className === 'drawerContainer') {
      return;
    }
    setDrawerExpanded(false);
  });
  useEffect(() => {
    document.documentElement.addEventListener('touchstart', onHideDrawer);
    return () => {
      document.documentElement.removeEventListener('touchstart', onHideDrawer);
    };
  }, [onHideDrawer]);
  return createPortal(
    <div
      className={styles.drawerContainer}
      style={{ height: drawerExpanded ? fullHeight : initialHeight }}
      onTouchStart={onMoveStart}
      onTouchEnd={onMoveEnd}
      onTouchCancel={onMoveCancel}
    >
      {/* 顶部指示符 */}
      {/* 内容 */}
      {children}
      {/* 提示文字 */}
      <div onClick={() => setDrawerExpanded(true)}>{placeholder}</div>
    </div>,
    document.body,
  );
}

export default Drawer;

Drawer.propTypes = {
  initialHeight: PropTypes.number,
  fullHeight: PropTypes.number,
  visible: PropTypes.bool,
  expanded: PropTypes.bool,
  placeholder: PropTypes.string,
  children: PropTypes.any,
};

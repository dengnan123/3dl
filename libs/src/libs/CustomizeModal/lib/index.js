import React, { useEffect, useState, useCallback } from 'react';
import classnames from 'classnames';
import { Icon } from 'antd';
// import { omit } from 'lodash';
// import { isString } from '../../../helpers/utils';

import styles from './index.less';

const CustomizeModal = props => {
  const { onChange, child: childComps = [], isHidden, style, width, height } = props;
  const {
    border = '1px solid #fff',
    borderRadius = '0px',
    backgroundColor,
    contentPadding = '0px',
    contentHorizontallyCentered = false,
    contentVerticallyCentered = false,
    aPosition = 'bottom',
    isShowMask = true,
    maskBgColor = 'rgba(0, 0, 0, 0.4)',
    isMaskClick = false,
    isShowClosed = true,
    iconSize = 20,
    iconColor = '#cccccc',
    iconTop = 10,
    iconRight = 10,
  } = style;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // setTimeout(() => {
    //   setVisible(!isHidden);
    // }, 200);
    setVisible(!isHidden);
  }, [isHidden]);

  const onCancel = useCallback(() => {
    // setVisible(false);
    // setTimeout(() => {
    //   onChange && onChange({ includeEvents: ['hiddenComps', 'clearApiData'] });
    // }, 200);
    onChange && onChange({ includeEvents: ['hiddenComps', 'clearApiData'] });
    setVisible(false);
  }, [onChange]);

  let renderData = [];
  if (!childComps || childComps.length === 0) {
    renderData = [];
  } else {
    renderData = (childComps || []).sort((a, b) => {
      return a.basicStyle.sortIndex - b.basicStyle.sortIndex;
    });
  }

  const renderPosition = useCallback(() => {
    const DISVISIBLE_POSITION = {
      left: {
        left: '0%',
        top: '50%',
        transform: 'translate(-100%, -50%)',
      },
      top: {
        left: '50%',
        top: '-50%',
        transform: 'translate(-50%, -50%)',
      },
      right: {
        left: '100%',
        top: '50%',
        transform: 'translate(0, -50%)',
      },
      bottom: {
        left: '50%',
        top: '100%',
        transform: 'translate(-50%, 0)',
      },
    };
    return DISVISIBLE_POSITION[aPosition];
  }, [aPosition]);

  const renderVisiblePosition = useCallback(() => {
    const VISIBLE_POSITION = {
      left: {
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },
      top: {
        top: '50%',
      },
      right: {
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },
      bottom: {
        top: '50%',
        transform: 'translate(-50%, -50%)',
      },
    };
    return VISIBLE_POSITION[aPosition];
  }, [aPosition]);

  // 显示ModalStyles
  let divPosition = renderPosition();

  // if (position === 'center') {
  //   divPosition = {
  //     left: '50%',
  //     top: '100%',
  //     transform: 'translate(-50%, 0)',
  //   };
  // } else {
  //   divPosition = {
  //     left: '50%',
  //     top: '100%',
  //     transform: 'translateX(-50%)',
  //   };
  // }

  /******Modal内容显示样式******/
  let displayStyles = {};
  if (visible) {
    displayStyles = {
      opacity: 1,
    };
    divPosition = {
      ...divPosition,
      ...renderVisiblePosition(),
    };
  }

  /****关联内容多个时必须成组*****/
  const item = renderData[0] ? renderData[0] : {};
  const { renderChildComp } = item;
  let renderChild = `关联内容多个时必须成组`;

  if (renderChildComp) {
    renderChild = renderChildComp;
  }

  let contentStyle = {};

  if (contentHorizontallyCentered) {
    contentStyle = {
      ...contentStyle,
      display: 'flex',
      justifyContent: 'center',
    };
  }

  if (contentVerticallyCentered) {
    contentStyle = {
      ...contentStyle,
      display: 'flex',
      alignItems: 'center',
    };
  }

  return (
    <div style={{ margin: 0, padding: 0 }}>
      {isShowMask && (
        <div
          className={classnames(styles['customize-mask'], { [styles.show]: visible })}
          style={{ backgroundColor: maskBgColor }}
          onClick={() => {
            if (!isMaskClick) return;
            onCancel();
          }}
        ></div>
      )}
      <div
        className={classnames(styles['customize-body'])}
        style={{
          position: 'absolute',
          ...divPosition,
          width,
          height,
          border,
          borderRadius,
          backgroundColor: backgroundColor || '#ffffff',
          padding: contentPadding,
          ...displayStyles,
        }}
      >
        {isShowClosed && (
          <div
            className={styles['close-icon']}
            style={{
              top: iconTop,
              right: iconRight,
            }}
            onClick={onCancel}
          >
            <Icon
              type="close"
              style={{
                fontSize: iconSize,
                color: iconColor,
              }}
            />
          </div>
        )}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            ...contentStyle,
          }}
        >
          {renderChild}
        </div>
      </div>
    </div>
  );
};

export default CustomizeModal;

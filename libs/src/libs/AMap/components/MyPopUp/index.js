import { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

import { reap } from '../../../../components/SafeReaper';
import { filterDataFunc } from '../../../../helpers/requestFilter';

import styles from './index.less';

function MyPopUp(props) {
  const { style, popupInfo } = props;

  const {
    show,
    carousel,
    width,
    height,
    borderRadius,
    padding,
    backgroundColor,
    opacity,
    formatter,
  } = reap(style, 'myPopUp', {
    show: false,
    carousel: false,
    interval: 2,
    width: '200px',
    height: 'auto',
    borderRadius: 0,
    padding: 10,
    backgroundColor: '#000000',
    opacity: 0.1,
  });

  const titleOption = reap(style, 'myPopUp.title', {
    show: true,
    fontSize: 20,
    color: '#ffffff',
    textAlign: 'left',
    lineHeight: 24,
    marginBottom: 10,
  });
  const contentOption = reap(style, 'myPopUp.content', {
    show: false,
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'left',
    lineHeight: 18,
  });

  const titleStyle = useMemo(() => {
    const d = { ...titleOption, lineHeight: `${titleOption.lineHeight}px` };
    delete d['show'];
    return d;
  }, [titleOption]);

  const contentStyle = useMemo(() => {
    const d = { ...contentOption, lineHeight: `${contentOption.lineHeight}px` };
    delete d['show'];
    return d;
  }, [contentOption]);

  const renderContent = useMemo(() => {
    if (formatter) {
      const formatterContent = filterDataFunc(formatter, popupInfo);
      return <div dangerouslySetInnerHTML={{ __html: formatterContent?.toString() }}></div>;
    }
    return (
      <>
        {titleOption.show && (
          <div className={styles.title} style={titleStyle}>
            {reap(popupInfo, 'name', '')}
          </div>
        )}
        {contentOption.show && (
          <>
            <p className={styles.text} style={contentStyle}>{`x: ${reap(popupInfo, 'x', 0)}`}</p>
            <p className={styles.text} style={contentStyle}>{`y: ${reap(popupInfo, 'y', 0)}`}</p>
          </>
        )}
      </>
    );
  }, [formatter, popupInfo, titleStyle, titleOption, contentOption, contentStyle]);

  return carousel && popupInfo ? (
    <div
      className={styles.popup}
      style={{
        left: reap(popupInfo, 'x', 0),
        top: reap(popupInfo, 'y', 0),
        width,
        height,
        borderRadius,
        display: popupInfo && show ? 'block' : 'none',
        padding,
        backgroundColor,
        opacity,
      }}
    >
      <div className={styles.content}>{renderContent}</div>
    </div>
  ) : null;
}

MyPopUp.propTypes = {
  style: PropTypes.object,
  popupInfo: PropTypes.object,
};

export default MyPopUp;

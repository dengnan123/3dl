import React, { useEffect, useState } from 'react';
import { reap } from '../../../../components/SafeReaper';
import styles from './index.less';
import { rgba } from 'polished';

function MapNews(props) {
  const { style, mapSourceData, map } = props;
  const {
    show,
    position,
    width,
    height,
    padding,
    background,
    borderRadius,
    titleFont,
    titleColor,
    contentFont,
    contentColor,
  } = reap(style, 'newsPop', {
    show: false,
    position: 'leftBottom',
    width: 'auto',
    height: 'auto',
    padding: 10,
    background: rgba(255, 255, 255, 1),
    borderRadius: 0,
    titleFont: 20,
    titleColor: rgba(0, 0, 0, 1),
    contentFont: 14,
    contentColor: rgba(0, 0, 0, 1),
    // opacity: 0.1,
  });

  const [popupInfo, setPopupInfo] = useState();

  useEffect(() => {
    let index = 0;
    setPopupInfo();

    if (!map || !mapSourceData) return;

    const action = () => {
      const popupInfo = mapSourceData.features[index];
      const zoom = map.getZoom();
      const lngLat = reap(popupInfo, 'properties.center', [0, 0]);
      const { x, y } = map.lngLatToContainer(lngLat, zoom);
      const newPopupInfo = { ...popupInfo, x, y };
      setPopupInfo(newPopupInfo);
      index++;
    };

    action();
  }, [mapSourceData, map]);

  let newPosition = {};
  switch (position) {
    case 'LeftTop':
      newPosition = { top: 0, left: 0 };
      break;
    case 'leftBottom':
      newPosition = { bottom: 0, left: 0 };
      break;
    case 'rightTop':
      newPosition = { top: 0, right: 0 };
      break;
    case 'rightBottom':
      newPosition = { bottom: 0, right: 0 };
      break;
    default:
      newPosition = { bottom: 0, left: 0 };
      break;
  }

  return (
    <>
      {show && (
        <div
          style={{ width, height, padding, background, borderRadius, ...newPosition }}
          className={styles.newsPopInfo}
        >
          <div className={styles.title} style={{ fontSize: titleFont, color: titleColor }}>
            {reap(popupInfo, 'properties.name', '')}
          </div>

          <div style={{ fontSize: contentFont, color: contentColor }}>this's content</div>
        </div>
      )}
    </>
  );
}

export default MapNews;

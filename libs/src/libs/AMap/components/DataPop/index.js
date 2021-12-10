import { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';

import { reap } from '../../../../components/SafeReaper';

import styles from './index.less';

function MyPopUp(props) {
  const { style, map, mapSourceData, dataSource } = props;

  const [popupInfo, setPopupInfo] = useState();
  // const [popupData, setPopupData] = useState([]);

  const {
    show,
    carousel,
    interval,
    width,
    height,
    borderRadius,
    padding,
    backgroundColor,
    opacity,
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

  const titleStyle = { ...titleOption, lineHeight: `${titleOption.lineHeight}px` };
  delete titleStyle['show'];

  const contentStyle = { ...contentOption, lineHeight: `${contentOption.lineHeight}px` };
  delete contentStyle['show'];

  useEffect(() => {
    setPopupInfo();

    if (!map || !mapSourceData || !show) return;
    const features = mapSourceData.features;
    const popupInfo = [];
    features.forEach(mapItem => {
      dataSource.forEach(dItem => {
        if (dItem.province === mapItem.properties.name) {
          // dItem.center = mapItem.center
          popupInfo.push({ ...dItem, center: mapItem.center });
        }
      });
    });
    // setPopupData(popupInfo);
    console.log('MyPopUp -> popupInfo', popupInfo);

    // const action = () => {
    //   const popupInfo = mapSourceData.features;
    //   const zoom = map.getZoom();
    //   const lngLat = reap(popupInfo, 'properties.center', [0, 0]);
    //   const { x, y } = map.lngLatToContainer(lngLat, zoom);
    //   const newPopupInfo = { ...popupInfo, x, y };
    //   setPopupInfo(newPopupInfo);
    // };

    // action();

    // if (carousel) {
    //   clock = setInterval(() => {
    //     if (index > mapSourceData.features.length - 1) {
    //       index = 0;
    //     }
    //     action();
    //   }, interval * 1000);
    // }

    // return () => {
    //   clearInterval(clock);
    //   clock = null;
    // };
  }, [mapSourceData, map, show, interval, carousel, dataSource]);

  return (
    <Fragment>
      {dataSource.map(item => {
        return (
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
            <div className={styles.content}>
              {titleOption.show && (
                <div className={styles.title} style={titleStyle}>
                  {reap(popupInfo, 'properties.name', '')}
                </div>
              )}
              {contentOption.show && (
                <div className={styles.contentText}>
                  <span>{item.title}</span>
                  <span>{item.titleNumber}</span>
                  <span>{item.subtitle}</span>
                  <span>{item.subtitleNumber}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </Fragment>
  );
}

MyPopUp.propTypes = {
  style: PropTypes.object,
  map: PropTypes.object,
  mapSourceData: PropTypes.object,
};

export default MyPopUp;

import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import styles from './OrderItem.less';
import moment from 'dayjs';
function OrderItem({ config, itemData }) {
  const {
    waingIcon,
    doingIcon,
    staffIcon,
    blinkFrequency,
    blinkDuration = 4000,
    borderColor,
    itemWidth,
    itemHeight,
    timeFontSize,
    floorFontSize,
    contentFontSize,
    staffFontSize,
  } = config;

  const {
    orderTime,
    backgroundColor = 'rgba(0,0,0,0)',
    floor,
    orderStatus,
    orderDetail,
    staff,
    isSelect = false,
    serviceTypeName,
    username,
  } = itemData;

  const [showBlink, setShowBlink] = useState(isSelect);

  useEffect(() => {
    if (!showBlink) return;
    const timer = setTimeout(() => {
      setShowBlink(false);
    }, blinkDuration);
    return () => {
      clearTimeout(timer);
    };
  }, [blinkDuration, showBlink]);

  const substrFloor = floor => {
    if (floor.length > 4) {
      return floor.substring(0, 4) + '...';
    }
    return floor;
  };

  const renderStaff = useCallback(() => {
    if (!staff || !staff.name) return;
    let { name } = staff;
    if (name.length > 4) {
      name = name.substring(0, 4);
    }
    return (
      <div className={styles.staff} style={{ fontSize: staffFontSize }}>
        <div className={styles.staffContainer}>
          <div className={styles.staffIcon}>{staffIcon && staffIcon}</div>
          <div className={styles.staffName}>{name}</div>
        </div>
      </div>
    );
  }, [staff, staffFontSize, staffIcon]);

  const renderIcon = useCallback(() => {
    let icon;
    if (orderStatus === 1) {
      icon = waingIcon;
    } else if (orderStatus === 2) {
      icon = doingIcon;
    } else {
      icon = waingIcon;
    }
    return <div className={styles.statusIcon}>{icon}</div>;
  }, [doingIcon, orderStatus, waingIcon]);

  return (
    <div
      className={styles.itemContainer}
      style={{
        backgroundColor: backgroundColor,
        width: itemWidth,
        height: itemHeight,
        fontSize: contentFontSize,
      }}
    >
      <div
        className={classnames(showBlink ? styles.breatheBorder : '')}
        // className={classnames(styles.breatheBorder)}
        style={{
          animationDuration: blinkFrequency,
          borderColor: borderColor,
          height: itemHeight,
        }}
      />
      <time className={styles.time} style={{ fontSize: timeFontSize }}>
        {orderTime && moment(orderTime).format('HH:mm')}
      </time>
      {renderIcon()}
      <div className={styles.floor} style={{ fontSize: floorFontSize }}>
        {floor && substrFloor(floor)}
      </div>
      <div className={styles.serviceName}>{serviceTypeName && serviceTypeName}</div>
      <div className={styles.username}>{username && username}</div>
      <div className={styles.des}>{orderDetail && orderDetail}</div>
      {renderStaff()}
    </div>
  );
}

OrderItem.propTypes = {
  config: PropTypes.object.isRequired,
  itemData: PropTypes.object.isRequired,
};

export default OrderItem;

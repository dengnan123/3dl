import React from 'react';
import PropTypes from 'prop-types';
import { Marker } from '@antv/l7-react';

function MyMarker(props) {
  const { children, lnglat, ...restProps } = props;

  const longitudeGd = lnglat?.[0];
  const latitudeGd = lnglat?.[1];

  if (isNaN(longitudeGd) || isNaN(latitudeGd)) {
    return null;
  }

  return (
    <Marker {...restProps} lnglat={[longitudeGd, latitudeGd]}>
      {children}
    </Marker>
  );
}

MyMarker.propTypes = {
  lnglat: PropTypes.array,
};

export default MyMarker;

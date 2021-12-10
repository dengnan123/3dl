import React from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';

// import jiahuiAir from '../../../assets/jiahuiAir.png';

function JiahuiAir(props) {
  const { data = {}, style } = props;
  const {
    // showTitle = false,
    // showMore = false,
    width = 223,
    height = 1000,
    tempTop = 224,
    humidityTop = 535,
    densityTop = 833,
    valueFontSize = 46,
    perFontSize = 24,
    BgImg = '',
  } = style || {};
  const widthHeight = { width, height };
  const valFont = { fontSize: valueFontSize };
  const perFont = { fontSize: perFontSize };
  return (
    <div className={styles.warpper} style={widthHeight}>
      <div className={styles.bgImg}>
        <img src={BgImg} alt="" style={widthHeight} />
      </div>
      <div className={styles.showData} style={widthHeight}>
        <p className={styles.temp} style={{ top: tempTop }}>
          <span style={valFont}>{data?.temp}</span>
          <span style={perFont}>℃</span>
        </p>
        <p className={styles.humidity} style={{ top: humidityTop }}>
          <span style={valFont}>{data?.humidity}</span>
          <span style={perFont}>%</span>
        </p>
        <p className={styles.density} style={{ top: densityTop }}>
          <span style={valFont}>{data?.density}</span>
          <span style={perFont}>ug/m³</span>
        </p>
      </div>
    </div>
  );
}

JiahuiAir.propTypes = {
  data: PropTypes.object,
};

export default JiahuiAir;

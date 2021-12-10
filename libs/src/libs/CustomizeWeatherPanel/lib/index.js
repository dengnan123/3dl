import { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

// import DefaultIcon from './default.svg';
import styles from './index.less';

function CustomizeWeather(props) {
  const [WEATHER_ID] = useState(`w-${uuid()}`);
  const [svgData, setSvgData] = useState(null);

  const { style = {}, height, width, data = {} } = props;

  const {
    svgUrl,
    svgWidth,
    svgHeight,
    svgColor = '#7ED321',
    svgAlign = 'center',
    dateHeight = 40,
    dateFontSize = 16,
    dateFontWeight = 500,
    dateColor = '#421FEE',
    dateTextAlign = 'center',
    tempHeight = 30,
    tempFontSize = 16,
    tempFontWeight = 400,
    tempColor,
    tempTextAlign = 'center',
    descHeight = 30,
    descFontSize = 16,
    descFontWeight = 400,
    descColor,
    descTextAlign = 'center',
  } = style || {};

  const { dateValue, tempRang, description, url } = data;

  const currentSvgUrl = url || svgUrl;

  useEffect(() => {
    if (!currentSvgUrl) {
      setSvgData('请输入对应天气的SVG图片!');
      return;
    }
    axios.get(currentSvgUrl).then(res => {
      const data = res.data;
      if (typeof data !== 'string' && data?.errorCode === 404) {
        setSvgData('没有该天气SVG资源，请联系管理员添加');
        return;
      }
      setSvgData(data);
    });
  }, [currentSvgUrl, WEATHER_ID]);

  useEffect(() => {
    const containerDom = document.getElementById(WEATHER_ID);
    if (!currentSvgUrl || !containerDom || !svgData) {
      return;
    }
    const svgDom = document.querySelector(`#${WEATHER_ID} svg`);
    // console.log(svgDom, '=====svgDom');
    if (!svgDom) return;
    if (svgWidth) {
      svgDom.style['width'] = svgWidth;
    }
    if (svgHeight) {
      svgDom.style['height'] = svgHeight;
    }
    let gDomRef = svgDom.querySelectorAll('g');
    if (gDomRef && svgColor) {
      for (let i = 0; i < gDomRef.length; i++) {
        if (gDomRef[i].style) {
          gDomRef[i].style['fill'] = svgColor;
        }
      }
    }
  }, [WEATHER_ID, svgData, currentSvgUrl, svgWidth, svgHeight, svgColor]);

  /**
   * 顶部信息
   */
  const RenderTopDate = useMemo(() => {
    if (!dateValue) {
      return;
    }
    return (
      <p
        style={{
          height: dateHeight,
          lineHeight: `${dateHeight}px`,
          fontSize: dateFontSize,
          fontWeight: dateFontWeight,
          color: dateColor,
          textAlign: dateTextAlign,
        }}
      >
        {dateValue}
      </p>
    );
  }, [dateValue, dateHeight, dateFontSize, dateFontWeight, dateColor, dateTextAlign]);

  /**
   * 温度范围信息=
   */
  const RenderTempRange = useMemo(() => {
    if (!tempRang) {
      return;
    }
    return (
      <p
        style={{
          height: tempHeight,
          lineHeight: `${tempHeight}px`,
          fontSize: tempFontSize,
          fontWeight: tempFontWeight,
          color: tempColor,
          textAlign: tempTextAlign,
        }}
      >
        {tempRang}
      </p>
    );
  }, [tempRang, tempHeight, tempFontSize, tempFontWeight, tempColor, tempTextAlign]);

  /**
   * 天气描述信息
   */
  const RenderDescriptionRange = useMemo(() => {
    if (!description) {
      return;
    }
    return (
      <p
        style={{
          height: descHeight,
          lineHeight: `${descHeight}px`,
          fontSize: descFontSize,
          fontWeight: descFontWeight,
          color: descColor,
          textAlign: descTextAlign,
        }}
      >
        {description}
      </p>
    );
  }, [description, descHeight, descFontSize, descFontWeight, descColor, descTextAlign]);

  return (
    <div style={{ height, width }} id={WEATHER_ID} className={styles.svgContainer}>
      {RenderTopDate}
      <p
        className={styles.svgIcon}
        style={{ textAlign: svgAlign }}
        dangerouslySetInnerHTML={{ __html: svgData }}
      ></p>
      {RenderTempRange}
      {RenderDescriptionRange}
    </div>
  );
}

CustomizeWeather.propTypes = {
  style: PropTypes.object,
};

export default CustomizeWeather;

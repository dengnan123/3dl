import React from 'react';
import moment from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';

const Bweek = ['', '一', '二', '三', '四', '五', '六', '七'];
function WeekComponent(props) {
  const {
    style: {
      isBig = true,
      isZh,
      upDoMargin,
      // fontSize,
      restFormatEN = 'dddd',
      restFormatCN = 'd',
      timeFontWeight,
      color = '#000000',
      disableLocalStorage = false,
      isFont = 'font',
      textAlign,
      weekFont,
      font,
    },
  } = props;
  const lang = localStorage.getItem('umi_locale') || 'zh-CN';
  moment.locale(isZh ? 'zh-CN' : 'en');

  const currentDate = moment();
  const timeStyles = {
    // fontSize: `${fontSize}px`,
    color,
    fontWeight: timeFontWeight,
  };
  const rander = () => {
    const cureentWeek = currentDate.format(restFormatCN);
    const element = {
      font: (
        <div style={{ ...timeStyles }}>
          <span style={{ fontSize: font }}>星期</span>
          <span style={{ fontSize: weekFont }}>{isBig ? Bweek[cureentWeek] : cureentWeek}</span>
        </div>
      ),
      back: (
        <div style={{ ...timeStyles }}>
          <span style={{ fontSize: weekFont }}>{isBig ? Bweek[cureentWeek] : cureentWeek}</span>
          <span style={{ fontSize: font }}>星期</span>
        </div>
      ),
      up: (
        <div style={{ ...timeStyles }}>
          <div
            style={{ textAlign, fontSize: font, marginTop: upDoMargin, marginBottom: upDoMargin }}
          >
            星期
          </div>
          <div
            style={{
              textAlign,
              fontSize: weekFont,
              marginTop: upDoMargin,
              marginBottom: upDoMargin,
            }}
          >
            {isBig ? Bweek[cureentWeek] : cureentWeek}
          </div>
        </div>
      ),
      down: (
        <div style={{ ...timeStyles }}>
          <div
            style={{
              textAlign,
              fontSize: weekFont,
              marginTop: upDoMargin,
              marginBottom: upDoMargin,
            }}
          >
            {isBig ? Bweek[cureentWeek] : cureentWeek}
          </div>
          <div
            style={{ textAlign, fontSize: font, marginTop: upDoMargin, marginBottom: upDoMargin }}
          >
            星期
          </div>
        </div>
      ),
    };
    return element[isFont];
  };

  if (disableLocalStorage) {
    if (!isZh) {
      return <span style={{ ...timeStyles }}>{currentDate.format(restFormatEN)}</span>;
    }
    return <div>{rander()}</div>;
  }
  if (lang === 'zh-CN') {
    return <div>{rander()}</div>;
  }
  return <span style={{ ...timeStyles }}>{currentDate.format(restFormatEN)}</span>;
}

WeekComponent.propTypes = {};

export default WeekComponent;

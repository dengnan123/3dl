import React from 'react';
import PropTypes from 'prop-types';
import moment from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import styles from './index.less';

moment.extend(advancedFormat);

class Time extends React.Component {
  state = {
    currentDate: moment(),
  };
  intervalTimer = null;

  componentDidMount() {
    clearInterval(this.dateSetHandler);
    this.dateSetHandler = setInterval(() => {
      this.setState({ currentDate: moment() });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.dateSetHandler);
    this.dateSetHandler = null;
  }

  renderDateContent = (lang = 'en-US') => {
    const { currentDate } = this.state;

    const {
      style: {
        fontSize,
        restFormatEN = 'ddd DD MMMM YYYY',
        restFormatCN = 'ddd MMMM DD YYYY',
        restFontWeight,
        color = '#000000',
      },
    } = this.props;

    const timeStyles = {
      fontSize: `${fontSize}px`,
      color,
      fontWeight: restFontWeight,
    };

    // if (disableLocalStorage) {
    //   return <span style={{ ...timeStyles }}>{currentDate.format(restFormatCN)}</span>;
    // }
    return lang === 'en-US' ? (
      <span style={{ ...timeStyles }}>{currentDate.format(restFormatEN)}</span>
    ) : (
      <span style={{ ...timeStyles }}>{currentDate.format(restFormatCN)}</span>
    );
  };

  render() {
    const { currentDate } = this.state;
    const {
      style: {
        timeFontSize,
        timeFormat = 'HH:mm:ss',
        timeFontWeight,
        timeColor = '#000000',
        textAlign = 'center',
        disableLocalStorage = false,
        isZh = true,
        timeFirst = true,
        isShowDate = true,
        isShowTime = true,
      },
      lang = 'zh-CN',
    } = this.props;

    let dayjsLang = lang === 'en-US' ? 'en' : 'zh-cn';

    if (disableLocalStorage) {
      dayjsLang = isZh ? 'zh-cn' : 'en';
    }

    moment.locale(dayjsLang);

    return (
      <div className={styles.timebox} style={{ textAlign }}>
        {!timeFirst && isShowDate && this.renderDateContent(this.props.lang)}
        {isShowTime && (
          <span
            className={styles.time}
            style={{ fontSize: `${timeFontSize}px`, color: timeColor, fontWeight: timeFontWeight }}
          >
            {currentDate.format(timeFormat)}
          </span>
        )}
        {timeFirst && isShowDate && this.renderDateContent(this.props.lang)}
      </div>
    );
  }
}

Time.propTypes = {
  style: PropTypes.object,
  lang: PropTypes.string,
};

export default Time;

import React, { Component } from 'react';
// import ReactEcharts from 'echarts-for-react';
import ReactEcharts from '../../../../components/EchartsForReact';
import { lineAndBarOpt } from '../../utils/lineAndBarUtil';
import { isString, isNumber, isArray, isFunction } from 'lodash';
import isEqual from 'fast-deep-equal';
import { reap } from '../../../../components/SafeReaper';
import { filterDataFunc } from '../../../../helpers/compile';
import { getNewOptions } from '../../utils/option';

export default class BarCom extends Component {
  state = {
    echarts_instance: null,
    tooltipIndex: 0,
    doTimer: false,
    timer: 3,
    series: [],
    categories: [],
    option: [],
  };

  chartClick = value => {
    const { onChange } = this.props;
    // console.log(value);
    onChange && onChange(value);
  };

  drillDown = v => {};

  start = () => {
    const { doTimer, timer } = this.state;
    if (doTimer) {
      this.tooltipTimer(timer);
    }
  };

  getOptsAndSetOpts() {
    const option = reap(this.props, 'style', {});
    const series = reap(this.props, 'data.series', []);
    const categories = reap(this.props, 'data.categories', []);
    const echarts_instance = this.echarts_react.getEchartsInstance();
    if (!echarts_instance) {
      return;
    }
    const opts =
      this.getOption({
        series,
        categories,
        option,
      }) || {};
    echarts_instance.setOption(opts, { notMerge: true });
  }

  componentDidUpdate(prevProps) {
    const { doTimer, timer } = this.state;
    const { style: option = {} } = this.props;

    const preBarGap = reap(this.props, 'style.series.barGap', '');
    const barGap = reap(prevProps, 'style.series.barGap', '');
    if (preBarGap !== barGap) {
      // echarts 实力 清除 主要是处理 数据堆叠显示里面的辅助数据，需要去掉
      const echarts_instance = this.echarts_react.getEchartsInstance();
      if (echarts_instance) {
        echarts_instance.clear();
      }

      this.getOptsAndSetOpts();
    }
    const propsDoTimer = reap(option, 'grid.tooltip.doTimer', false);
    let propsTimer = reap(option, 'grid.tooltip.timer', 3);
    if (
      JSON.stringify(doTimer) !== JSON.stringify(propsDoTimer) ||
      JSON.stringify(propsTimer) !== JSON.stringify(timer)
    ) {
      this.setState(
        {
          doTimer: propsDoTimer,
          timer: propsTimer,
        },
        () => {
          if (propsDoTimer) {
            // 开启定时器
            this.tooltipTimer(timer);
          } else {
            // 关闭
            this.clear();
          }
        },
      );
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { data, style } = nextProps;
    if (!isEqual(data, this.props.data)) {
      return true;
    }
    if (!isEqual(style, this.props.style)) {
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    const { timerId, _timer } = this.state;
    clearInterval(timerId);
    clearTimeout(_timer);
  }

  // 触发tooltip轮播定时器
  tooltipTimer = () => {
    const that = this;
    const echarts_instance = this.echarts_react.getEchartsInstance();
    if (!echarts_instance) {
      return;
    }
    const { timer } = this.state;
    this.clear();

    echarts_instance.dispatchAction({
      type: 'showTip',
      seriesIndex: 0,
      dataIndex: 0,
    });

    const { mockData = {} } = this.props;
    const { series = [] } = mockData;
    const timerId = setInterval(() => {
      const { tooltipIndex } = that.state;

      echarts_instance.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
        dataIndex: tooltipIndex,
      });

      let newIndex = tooltipIndex + 1;
      if (series.length && newIndex >= series[0].data.length) {
        newIndex = 0;
      }
      that.setState({
        tooltipIndex: newIndex,
      });
    }, timer * 1000);

    this.setState({
      timerId,
    });
  };

  getOption = ({ categories, series, option, type }) => {
    const op = lineAndBarOpt({ categories, series, option, type }) || {};
    /**
     * options 拓展
     */
    return getNewOptions(this.props, op);
  };

  checkSeries = series => {
    if (!isArray(series)) {
      return 'series不是数组';
    }
    for (const v of series) {
      const { data } = v;

      if (!isArray(data)) {
        return 'series里面的data不是数组';
      }
      for (const item of data) {
        if (!isNumber(item)) {
          return 'series data里面的数据不是数字';
        }
      }
    }
    return false;
  };

  checkCategories = categories => {
    // 检查categories
    if (!isArray(categories)) {
      return 'categories不是数组';
    }
    for (const item of categories) {
      if (!isNumber(item) && !isString(item)) {
        return 'categories里面的数据不是数字或者文字';
      }
    }
    return false;
  };

  getNowArr = selected => {
    const { data = {} } = this.props;
    const { series } = data;
    let newArr = [];
    for (const v of series) {
      if (selected[v.name]) {
        newArr.push(v);
      }
    }
  };

  legendselectchanged = v => {
    const { data = {} } = this.props;
    const { series } = data;
    const { selected } = v;

    const keys = Object.keys(selected);
    // 不是最后一个  不是唯一一个 true
    const getType = name => {
      if (!selected[name]) {
        return 'legendUnSelect';
      }
      return 'legendSelect';
    };
    const echarts_instance = this.echarts_react.getEchartsInstance();
    if (!echarts_instance) {
      return;
    }
    series.map((v, index) => {
      const { name } = v;
      echarts_instance.dispatchAction({
        type: getType(name),
        // 图例名称
        name: `help${name}`,
      });
      return null;
    });
    const trueKeys = [];
    for (const key of keys) {
      if (selected[key]) {
        trueKeys.push(key);
      }
    }
    const lastKey = trueKeys[trueKeys.length - 1];
    echarts_instance.dispatchAction({
      type: 'legendUnSelect',
      name: `help${lastKey}`,
    });
  };

  _onEvents = {
    click: this.chartClick,
    legendselectchanged: this.legendselectchanged,
    // dataZoom: this.onDataZoom,
  };

  chartDivClick = () => {
    const { onClick } = this.props;
    const echarts_instance = this.echarts_react.getEchartsInstance();
    if (echarts_instance) {
      const imageSrc = echarts_instance.getDataURL({
        pixelRatio: 1,
        backgroundColor: '#fff',
      });

      onClick &&
        onClick({
          imageSrc,
        });
    }
  };

  render() {
    const { data = {}, style: option = {}, type } = this.props;
    const { series, categories } = data;

    const legend = {};
    legend.data = (data?.series || []).map(item => {
      return item.name;
    });

    const options = this.getOption({ series, categories, type, option });

    return (
      <ReactEcharts
        onClick={this.chartDivClick}
        id="echats"
        notMerge={true}
        lazyUpdate={true}
        ref={e => {
          this.echarts_react = e;
        }}
        option={options}
        style={{ height: '100%', width: '100%' }}
        className="react_for_echarts"
        onEvents={this._onEvents}
      />
    );
  }
}

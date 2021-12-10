import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { v4 } from 'uuid';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

const id = v4();
const currentDivId = `amchart-${id}`;
am4core.useTheme(am4themes_animated);

function PieChart3D(props) {
  const { data = [], config } = props;
  const [seriesData, setSeriesData] = useState([]);

  useEffect(() => {
    if (!data || !data.length) {
      return;
    }

    setSeriesData(data);
  }, [data]);

  const chart = useRef(null);

  useLayoutEffect(() => {
    const {
      innerRadius = 0,
      showStroke = false,
      strokeColor = '#fff',
      strokeWidth = 2,
      strokeOpacity = 1,
      showLegend = false,

      legendPosition = 'bottom',
      // legendMaxWidth,
      legendMaxHeight,
      legendScroll = false,
      legendWidth = 20,
      legendHeight = 20,
      legendRadius = 20,
      showTooltip = true,
      fontSize = 14,
      fontColor,
    } = config;

    let pieChart = am4core.create(currentDivId, am4charts.PieChart3D);
    pieChart.innerRadius = am4core.percent(innerRadius);
    pieChart.data = seriesData;

    if (showLegend) {
      pieChart.legend = new am4charts.Legend();
      let markerTemplate = pieChart.legend.markers.template;
      let marker = markerTemplate.children.getIndex(0);
      marker.cornerRadius(legendRadius, legendRadius, legendRadius, legendRadius);
      markerTemplate.width = legendWidth;
      markerTemplate.height = legendHeight;
      if (legendMaxHeight) {
        pieChart.legend.maxHeight = legendMaxHeight;
        pieChart.legend.scrollable = legendScroll;
      }
      // pieChart.legend.maxWidth = legendMaxWidth || undefined;
      pieChart.legend.position = legendPosition;
    }

    let series = pieChart.series.push(new am4charts.PieSeries3D());
    let seriesTemplate = series.slices.template;
    series.dataFields.value = 'value';
    series.dataFields.category = 'key';
    series.labels.template.disabled = true;
    series.ticks.template.disabled = true;
    if (showStroke) {
      seriesTemplate.stroke = am4core.color(strokeColor);
      seriesTemplate.strokeWidth = strokeWidth;
      seriesTemplate.strokeOpacity = strokeOpacity;
    }

    seriesTemplate.configField = 'config';
    seriesTemplate.propertyFields.fill = 'color';
    seriesTemplate.states.getKey('hover').properties.shiftRadius = 0;
    seriesTemplate.states.getKey('hover').properties.scale = 1.1;

    // Set up tooltip
    series.tooltip.disabled = !showTooltip;
    seriesTemplate.tooltipText = '{category}: {value}';
    if (fontColor && !showTooltip) {
      series.tooltip.getFillFromObject = false;
      series.tooltip.label.propertyFields.fill = am4core.color(fontColor);
    }
    series.tooltip.label.fontSize = fontSize;

    seriesTemplate.events.on('hit', function(ev) {
      let series = ev.target.dataItem.component;
      series.slices.each(item => {
        if (item.isActive && item !== ev.target) {
          item.isActive = false;
        }
      });
    });

    chart.current = pieChart;

    return () => {
      pieChart.dispose();
    };
  }, [seriesData, config]);

  return <div id={currentDivId} style={{ width: '100%', height: '100%' }}></div>;
}
export default PieChart3D;

import ReactEcharts from '../../../../components/EchartsForReact';
import '../echarts-liquidfill/src/liquidFill';

const WaterPoloLib = props => {
  const { style, data } = props;
  const { waterData = [], liquidColor } = data;
  const {
    radius = 80,
    bgColor = '#dff6ff',
    fontSize = 40,
    defaultFontColor = '#D0021B',
    fontColor = '#7ED321',

    borderWidth = 6,
    borderColor = '#206E7B',
    shadowBlur = 0,
    shadowColor = 'rgba(255, 255, 255, 1)',
    borderDistance = 5,
  } = style;

  return (
    <ReactEcharts
      style={{ height: '100%', width: '100%' }}
      option={{
        series: [
          {
            type: 'liquidFill',
            data: waterData,
            radius: `${radius}%`,
            label: {
              normal: {
                textStyle: {
                  fontSize: fontSize,
                  color: defaultFontColor,
                  insideColor: fontColor,
                },
              },
            },
            backgroundStyle: {
              color: bgColor,
            },
            outline: {
              borderDistance: borderDistance,
              itemStyle: {
                borderWidth: borderWidth,
                borderColor: borderColor,
                shadowBlur: shadowBlur,
                shadowColor: shadowColor,
              },
            },
            color: liquidColor && liquidColor,
            // color: [
            //   {
            //     type: 'linear',
            //     x: 0,
            //     y: 0,
            //     x1: 1,
            //     y1: 0,
            //     colorStops: [
            //       {
            //         offset: 0,
            //         color: '#E373BA',
            //       },
            //       {
            //         offset: 1,
            //         color: '#F6F38A',
            //       },
            //     ],
            //     globalCoord: false,
            //   },
            // ],
          },
        ],
      }}
    />
  );
};

export default WaterPoloLib;

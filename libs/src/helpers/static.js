const Line = () => {
  return {
    categories: [
      '2020-02-26',
      '2020-02-27',
      '2020-02-28',
      '2020-02-29',
      '2020-03-01',
      '2020-03-02',
      '2020-03-03',
      '2020-03-04',
      '2020-03-05',
      '2020-03-06',
      '2020-03-07',
      '2020-03-08',
    ],
    series: [
      {
        name: '上周',
        type: 'line',
        data: [4120, 2653, 1614, 2717, 1766, 2214, 1320, 1534, 3560, 1840, 3702, 2308],
      },
      {
        name: '昨日',
        type: 'line',
        data: [8684, 16288, 15484, 19924, 18559, 18246, 15017, 18350, 11004, 10398, 19881, 19600],
      },
      {
        name: '今日',
        type: 'line',
        data: [21461, 27325, 26166, 5259, 20525, 18461, 19836, 28692, 24340, 14132, 25972, 14894],
      },
    ],
  };
};

const Bar = () => {
  return {
    categories: [
      '2020-02-26',
      '2020-02-27',
      '2020-02-28',
      '2020-02-29',
      '2020-03-01',
      '2020-03-02',
      '2020-03-03',
      '2020-03-04',
      '2020-03-05',
      '2020-03-06',
      '2020-03-07',
      '2020-03-08',
    ],
    series: [
      {
        name: '上周',
        type: 'bar',
        data: [4120, 2653, 1614, 2717, 1766, 2214, 1320, 1534, 3560, 1840, 3702, 2308],
      },
      {
        name: '昨日',
        type: 'bar',
        data: [8684, 16288, 15484, 19924, 18559, 18246, 15017, 18350, 11004, 10398, 19881, 19600],
      },
      {
        name: '今日',
        type: 'bar',
        data: [21461, 27325, 26166, 5259, 20525, 18461, 19836, 28692, 24340, 14132, 25972, 14894],
      },
    ],
  };
};

const Pie = () => {
  return {
    categories: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎'],
    series: [
      {
        data: [
          { value: 335, name: '直接访问' },
          { value: 310, name: '邮件营销' },
          { value: 234, name: '联盟广告' },
          { value: 135, name: '视频广告' },
          { value: 1548, name: '搜索引擎' },
        ],
      },
    ],
  };
};

export default {
  Line,
  Bar,
  Pie,
};

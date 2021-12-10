export default  {
  dataSource: [
    {
      value: 'zhejiang',
      label: '浙江',
      labelEn: 'Zhejiang',
      children: [
        {
          value: 'hangzhou',
          label: '杭州',
          labelEn: 'Hangzhou',
          children: [
            {
              value: 'xihu',
              label: '西湖',
              labelEn: 'West Lake',
              children: [{ value: 'wuye1', label: '物业1', labelEn: 'wuye1' }],
            },
          ],
        },
      ],
    },
    {
      value: 'jiangsu',
      label: '江苏',
      labelEn: 'Jiangsu',
      children: [
        {
          value: 'nanjing',
          label: '南京',
          labelEn: 'Nanjing',
          children: [
            {
              value: 'zhonghuamen',
              label: '中华门',
              labelEn: 'Zhong Hua Men',
            },
          ],
        },
      ],
    },
  ],
};

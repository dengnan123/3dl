export default  {
  columns: [
    { title: '楼层', dataIndex: 'floor', key: 'floor' },
    { title: '工位数', dataIndex: 'deskNumber', key: 'deskNumber' },
    { title: '会议室数', dataIndex: 'roomNumber', key: 'roomNumber' },
    { title: '平均使用率', dataIndex: 'usageRate', key: 'usageRate' },
  ],
  dataSource: [
    { key: '1', floor: 23, deskNumber: '12', roomNumber: '10', usageRate: '80%' },
    { key: '2', floor: 24, deskNumber: '11', roomNumber: '11', usageRate: '90%' },
    { key: '2', floor: 24, deskNumber: '11', roomNumber: '11', usageRate: '90%' },
    { key: '2', floor: 24, deskNumber: '11', roomNumber: '11', usageRate: '90%' },
  ],
};

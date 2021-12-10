import moment from 'dayjs';

export default {
  dataSource: [
    {
      id: '1',
      startTime: moment().valueOf(),
      endTime: moment()
        .add(30, 'minute')
        .valueOf(),
      title: '会议主题',
      organizerName: '小明',
    },
    {
      id: '2',
      startTime: moment()
        .add(3, 'hour')
        .add(15, 'minute')
        .valueOf(),
      endTime: moment()
        .add(5, 'hour')
        .add(15, 'minute')
        .valueOf(),
      title: '会议主题',
      organizerName: '小明',
    },
    {
      id: '3',
      startTime: moment()
        .subtract(1, 'hour')
        .valueOf(),
      endTime: moment()
        .subtract(40, 'minute')
        .valueOf(),
      title: '会议主题',
      organizerName: '小明',
    },
  ],
};

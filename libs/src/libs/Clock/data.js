import moment from 'dayjs';

const data = {
  dataSource: [
    {
      id: '1',
      startTime: moment().valueOf(),
      endTime: moment()
        .add(30, 'minute')
        .valueOf(),
      color: '#FE6223',
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
      color: '#CC2D07',
    },
    {
      id: '3',
      startTime: moment()
        .subtract(1, 'hour')
        .valueOf(),
      endTime: moment()
        .subtract(40, 'minute')
        .valueOf(),
      color: '#273454',
    },
  ],
};
export default data;

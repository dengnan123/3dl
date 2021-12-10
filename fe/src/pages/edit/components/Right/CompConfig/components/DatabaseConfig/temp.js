export const QueryData = {
  columns: [
    {
      name: 'building_name',
    },
    {
      name: 'data_month',
    },
    {
      name: 'sum(a.capacity)',
    },
    {
      name: 'sum(a.alloted)',
    },
  ],
  rows: [
    {
      building_name: '1',
      data_month: '202103',
      'sum(a.capacity)': '4',
      'sum(a.alloted)': null,
    },
    {
      building_name: '101',
      data_month: '202103',
      'sum(a.capacity)': '5',
      'sum(a.alloted)': '1',
    },
    {
      building_name: '3333',
      data_month: '202103',
      'sum(a.capacity)': '8',
      'sum(a.alloted)': null,
    },
    {
      building_name: 'pj-test-小区',
      data_month: '202103',
      'sum(a.capacity)': '3',
      'sum(a.alloted)': '2',
    },
    {
      building_name: '1',
      data_month: '202104',
      'sum(a.capacity)': '2',
      'sum(a.alloted)': null,
    },
    {
      building_name: '101',
      data_month: '202104',
      'sum(a.capacity)': '6',
      'sum(a.alloted)': '1',
    },
    {
      building_name: '3333',
      data_month: '202104',
      'sum(a.capacity)': '9',
      'sum(a.alloted)': null,
    },
    {
      building_name: 'pj-test-小区',
      data_month: '202104',
      'sum(a.capacity)': '3',
      'sum(a.alloted)': '2',
    },
  ],
};

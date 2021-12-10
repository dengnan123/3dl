const nameList = ['John Brown', 'Jim Green', 'Joe Black', 'Jim Red', 'Jake White'];
const addressList = [
  'New York No. 1 Lake Park',
  'London No. 1 Lake Park',
  'Sidney No. 1 Lake Park',
  'London No. 2 Lake Park',
  'Dublin No. 2 Lake Park',
];

const dataSource = Array(10)
  .fill(0)
  .map((n, i) => {
    return {
      name: nameList[parseInt(Math.random() * nameList.length)],
      age: parseInt(Math.random() * 30 + 18),
      tel: '0571-22098909',
      phone: 18889898888,
      usageRate: `${parseInt(Math.random() * 100)}%`,
      address: addressList[parseInt(Math.random() * addressList.length)],
    };
  });

export default {
  columns: [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: false,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      sorter: false,
      filterProps: {
        type: 'select',
        allowClear: true,
        options: [
          {
            label: '未满18',
            value: '1',
          },
          {
            label: '大于18',
            value: '2',
          },
        ],
      },
    },
    {
      title: 'Home phone',
      dataIndex: 'tel',
      sorter: false,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      sorter: false,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      sorter: false,
    },
    {
      title: '操作',
      dataIndex: '_action',
      sorter: false,
      noFilter: true,
      actionList: [
        { name: '查看工单', value: '查看工单', style: { color: '#1991eb', cursor: 'pointer' } },
      ],
    },
  ],
  dataSource,
  totalElements: 15,
};

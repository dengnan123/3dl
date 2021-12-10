const nameList = ['John Brown', 'Jim Green', 'Joe Black', 'Jim Red', 'Jake White'];
const addressList = [
  'New York No. 1 Lake Park',
  'London No. 1 Lake Park',
  'Sidney No. 1 Lake Park',
  'London No. 2 Lake Park',
  'Dublin No. 2 Lake Park',
];

const dataSource = Array(20)
  .fill(0)
  .map((n, i) => {
    return {
      name: nameList[parseInt(Math.random() * nameList.length)],
      age: parseInt(Math.random() * 30 + 18),
      tel: '0571-22098909',
      phone: 18889898888,
      usageRate: `${parseInt(Math.random() * 100)}%`,
      address: addressList[parseInt(Math.random() * addressList.length)],
      hasClick: true,
    };
  });

export default {
  columns: [
    {
      title: 'Name',
      dataIndex: 'name',
      canClick: true,
    },
    {
      title: '合并',
      children: [
        {
          title: 'Age',
          canClick: true,
          dataIndex: 'age',
        },
        {
          title: 'Home phone',
          dataIndex: 'tel',
        },
      ],
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
  ],
  dataSource,
};

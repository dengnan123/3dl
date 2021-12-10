import { Table } from 'antd';
import { v4 as uuid } from 'uuid';

export default ({ data: pdata, keysMap }) => {
  if (!pdata) {
    return null;
  }
  const { columns, rows } = pdata;
  const tableColumns = columns.map(v => {
    const { name } = v || {};
    const keysItem = keysMap[name];
    let title = name;
    if (keysItem?.as) {
      title = keysItem.as ?? name;
    }
    return {
      title: title,
      dataIndex: v.name,
      key: v.name,
    };
  });
  const data = rows.map(v => {
    return {
      key: uuid(),
      ...v,
    };
  });
  return <Table columns={tableColumns} dataSource={data} className={'dm-table-primary'}></Table>;
};

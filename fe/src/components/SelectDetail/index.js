import { Select } from 'antd';
import styles from './index.less';
const { Option } = Select;
export default ({
  onChange,
  value,
  apiHostList,
  valueChangeCb,
  disabled,
  redashDatasourceList,
  detail,
}) => {
  const getDetail = () => {
    if (!redashDatasourceList?.length) {
      return detail;
    }
    return redashDatasourceList.filter(v => v.id === detail)[0]?.name;
  };

  return (
    <div className={styles.wrapDiv}>
      <Select
        style={{ width: 200 }}
        onChange={v => {
          onChange(v);
        }}
        value={value}
        placeholder="请选择数据源"
        disabled={disabled}
      >
        {apiHostList.map(v => {
          return <Option value={v.value}>{v.remark}</Option>;
        })}
      </Select>
      <span className={styles.detail}>{getDetail()}</span>
    </div>
  );
};

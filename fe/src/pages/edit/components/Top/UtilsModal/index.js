import { useState, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Drawer, Button, Collapse, Select, Tooltip } from 'antd';
import { getParseSearch } from '@/helpers/utils';
import { windowUtilList } from '@/helpers/windowUtil';
import { copyToClip } from '@/helpers/utils';
import AddCustomFunc from '@/components/AddCustomFunc';
import styles from './index.less';

const { Panel } = Collapse;

function UtilsModal(props) {
  const [selected, setSelected] = useState([]);
  const [visible, setVisible] = useState(false);

  const allUtilList = useMemo(() => {
    return (windowUtilList || []).reduce((a, b) => {
      if (Array.isArray(a)) {
        return [...a, ...b.children];
      }
      return [...a.children, ...b.children];
    });
  }, []);

  const onChange = useCallback(n => {
    setSelected(n ? [JSON.parse(n)] : []);
  }, []);

  const renderChildren = useCallback(arr => {
    return (arr || []).map(n => {
      const { label, usage, description } = n || {};
      return (
        <div className={styles.box} key={label}>
          <Tooltip title="点击复制" getPopupContainer={trigger => trigger}>
            <h3 onClick={() => copyToClip(label)}>{label}</h3>
          </Tooltip>
          <p>用法：{usage}</p>
          <p>{description}</p>
        </div>
      );
    });
  }, []);

  const { tagId, pageId } = getParseSearch();
  const tagCustomFuncProps = {
    tagId,
  };
  const pageCustomFuncProps = {
    pageId,
  };
  return (
    <>
      {ReactDOM.createPortal(
        <div className={styles.utilContainer}>
          <Button type="link" onClick={() => setVisible(true)}>
            全局函数
          </Button>
        </div>,
        document.body,
      )}

      <Drawer
        visible={visible}
        zIndex={100000}
        title="全局函数(挂载在window上)"
        className={styles.utilDrawer}
        onClose={() => setVisible(false)}
        mask={false}
        width={400}
        placement="left"
      >
        <Select
          placeholder="查找对应函数"
          showSearch={true}
          allowClear={true}
          onChange={onChange}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          style={{ width: '100%' }}
          getPopupContainer={triggerNode => triggerNode}
        >
          {allUtilList.map(n => {
            const { label } = n;
            return (
              <Select.Option key={JSON.stringify(n)} value={JSON.stringify(n)}>
                {label}
              </Select.Option>
            );
          })}
        </Select>

        {selected.length ? (
          renderChildren(selected)
        ) : (
          <Collapse expandIconPosition="right" defaultActiveKey="customFunc">
            {(windowUtilList || []).map(n => {
              const { label, children } = n || {};
              return (
                <Panel key={label} header={label}>
                  {renderChildren(children)}
                </Panel>
              );
            })}
            {/* <Panel key="publicCustomFunc" header="通用自定义函数">
              <CustomFunc></CustomFunc>
            </Panel> */}
            <Panel header="项目自定义函数" key="tagCustomFunc">
              <AddCustomFunc {...tagCustomFuncProps}></AddCustomFunc>
            </Panel>
            <Panel key="customFunc" header="页面自定义函数">
              <AddCustomFunc {...pageCustomFuncProps}></AddCustomFunc>
            </Panel>
          </Collapse>
        )}
      </Drawer>
    </>
  );
}

export default UtilsModal;

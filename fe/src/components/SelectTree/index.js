import { Tree } from 'antd';
import { useState } from 'react';
const { TreeNode } = Tree;

const SelectTree = ({ data, onClick }) => {
  const [checkedKeys, setKeys] = useState([]);
  const onSelect = (selectedKeys, info) => {
    console.log('selectedKeys', selectedKeys);
  };

  const onCheck = (checkedKeys, info) => {
    const keyArr = [info.node.props.id || info.node.props.dataRef.id];
    setKeys(keyArr);
    onClick && onClick(keyArr);
  };

  const renderTreeNodes = data =>
    data.map(item => {
      const childData = item.child || item.children;
      const title = item.aliasName || item.compName;
      if (!!childData) {
        return (
          <TreeNode title={title} key={item.id} dataRef={item}>
            {renderTreeNodes(childData)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={title} disabled />;
    });

  return (
    <Tree
      checkable
      onSelect={onSelect}
      checkStrictly={true}
      onCheck={onCheck}
      checkedKeys={checkedKeys}
    >
      {renderTreeNodes(data)}
    </Tree>
  );
};

export default SelectTree;

// import { useCallback } from 'react';
import { Button } from 'antd';
import { getNameByLang } from '../../../helpers/lang';
import { v4 } from 'uuid';

export const getBtnFunc = ({ childComps, updateState, defaultChildData, setChildComps, style }) => {
  const addOrDelete = payload =>
    setChildComps(state => {
      const { type, data } = payload;
      if (type === 'add') {
        return [...state, defaultChildData(v4())];
      } else {
        return state.filter(v => v.childId !== data);
      }
    });

  const onAddClicked = id => {
    addOrDelete({ data: id, type: 'add' });
  };

  const onDeleteClicked = id => {
    addOrDelete({ data: id, type: 'delete' });
  };

  const {
    MAX_COUNT = 5,
    addContent = '添加',
    addContentEn = 'Add',
    deleteContent = '删除',
    deleteContentEn = 'Delete',
    addType = 'default',
    deleteType = 'default',
    lang,
  } = style;

  console.log(style);

  const addBtn = id => (
    <Button
      onClick={onAddClicked}
      type={addType}
      style={{ ...style }}
      disabled={childComps.length >= MAX_COUNT}
    >
      {getNameByLang(lang, addContent, addContentEn)}
    </Button>
  );

  const deleteBtn = id => (
    <Button onClick={onDeleteClicked.bind(this, id)} type={deleteType} style={{ ...style }}>
      {getNameByLang(lang, deleteContent, deleteContentEn)}
    </Button>
  );

  return { onAddClicked, onDeleteClicked, addBtn, deleteBtn };
};

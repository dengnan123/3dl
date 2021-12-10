import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import querystring from 'query-string';
import { useStyle } from '../option';
import { Menu } from 'antd';
import styles from './index.less';

const { SubMenu } = Menu;

function RenderMenuItem({ item }) {
  if (item.children) {
    return (
      <SubMenu key={item.key} title={item.name} info={item}>
        {item.children.map(childrenItem => RenderMenuItem({ item: childrenItem }))}
      </SubMenu>
    );
  }
  return (
    <Menu.Item key={item.key} info={item}>
      {item.name}
    </Menu.Item>
  );
}
RenderMenuItem.propTypes = {
  item: PropTypes.object,
};

function getMenus(data) {
  let dataSource = data?.dataSource ?? [];

  if (!(dataSource instanceof Array)) {
    dataSource = [];
  }
  return dataSource;
}

function AntdMenu(props) {
  const query = querystring.parse(decodeURIComponent(window.location.search));

  const { data, style, onChange } = props;
  const menus = getMenus(data);
  const [selectItem, setSelectItem] = useState();
  const { compKey } = useStyle(style);

  const handleOnChange = useCallback(
    item => {
      onChange && onChange({ [compKey]: item });
    },
    [compKey, onChange],
  );

  const handleMenuItemClick = useCallback(
    ({ item }) => {
      const selectItem = item?.props?.info;

      setSelectItem(selectItem);
      handleOnChange(selectItem);
    },
    [handleOnChange],
  );

  useEffect(() => {
    let select = null;
    if (selectItem) {
      return;
    }

    if (query._menukey) {
      select = checkIfExist(menus, query._menukey);
    }

    if (!select) {
      select = getInitSelectItem(menus);
    }

    setSelectItem(select);
    handleOnChange({ ...select, _init: true });
  }, [selectItem, menus, query._menukey, handleOnChange]);

  return (
    <Menu
      className={styles.container}
      selectedKeys={selectItem?.key}
      mode="inline"
      onClick={handleMenuItemClick}
    >
      {menus?.map(item => RenderMenuItem({ item }))}
    </Menu>
  );
}

AntdMenu.propTypes = {
  onChange: PropTypes.func,
  data: PropTypes.object,
  style: PropTypes.object,
};

export default AntdMenu;

/**
 * 检查是否存在menu，并且返回查找的值
 * @param {arr} menus
 * @param {string} key
 */
function checkIfExist(menus, key) {
  let select = null;

  if (!(menus instanceof Array) || !menus || !menus.length) {
    return select;
  }

  function _find(arr = []) {
    if (select) return;
    for (const item of arr) {
      if (item.children && item.children.length) {
        _find(item.children);
      } else {
        if (`${item.key}` === `${key}`) {
          select = item;
          return;
        }
      }
    }
  }
  _find(menus);
  return select;
}

function getInitSelectItem(menus) {
  let select = null;

  function _find(arr = []) {
    if (select) return;
    for (const item of arr) {
      if (item.children && item.children.length) {
        _find(item.children);
      } else {
        select = item;
        return;
      }
    }
  }
  _find(menus);
  return select;
}

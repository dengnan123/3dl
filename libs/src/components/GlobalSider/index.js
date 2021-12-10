// import pathToRegexp from 'path-to-regexp'
import { Icon, Layout, Menu } from 'antd';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { menus } from './menu';
import styles from './index.less';

// let oldIndex = 0

class GlobalSidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openKeys: [],
      selectedKeys: [],
      isNeedShowSelect: false,
      currentUrl: null,
    };
    this.pathHashArr = menus;
  }

  _newGetMenus = (menusTree, isChildren) => {
    const { locationPathname } = this.props;
    const actArr = this.pathHashArr[locationPathname] || [];
    return menusTree.map((item, index) => {
      const { children, code, path, icon, name, activeIcon } = item;
      const nowSelect = locationPathname === path ? styles.isSelect : null;
      const parentSelect = actArr.includes(path) ? styles.parentSelect : null;
      if (!children || !children.length) {
        return (
          <Menu.Item id={code} key={index} className={classnames(nowSelect, parentSelect)}>
            <Link to={path} className={styles.iconSpan}>
              <i className="anticon anticon-user">{actArr.includes(path) ? activeIcon : icon}</i>
              <span>
                {isChildren ? <span>&nbsp;&nbsp;</span> : null}
                {name}
              </span>
            </Link>
          </Menu.Item>
        );
      }
      return (
        <Menu.SubMenu
          key={index}
          className={classnames(nowSelect, parentSelect)}
          title={
            <span className={styles.iconSpan}>
              <i className="anticon anticon-user">{actArr.includes(path) ? activeIcon : icon}</i>
              <span>{name}</span>
            </span>
          }
        >
          {this._newGetMenus(children, true)}
        </Menu.SubMenu>
      );
    });
  };
  getDefaultMenu = () => {
    const { location } = window;
    const { href, origin } = location;
    const currentUrl = href.slice(origin.length);
    return currentUrl;
  };

  setIconColor = () => {};
  render() {
    return (
      <Layout.Sider
        width={document.body.clientWidth >= 1600 ? 320 : 260}
        theme="light"
        trigger={null}
        collapsible
        className={styles.sider}
        onClick={this.setIconColor}
      >
        <Menu
          mode="inline"
        //   defaultSelectedKeys={[this.getDefaultMenu()]}
        //   defaultOpenKeys={[this.getDefaultOpen()]}
          className={styles.menu}
        >
          {this._newGetMenus(menus)}
        </Menu>
      </Layout.Sider>
    );
  }
}

export default GlobalSidebar;

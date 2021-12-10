import { useState } from 'react';
import classnames from 'classnames';
import { MENU_LIST } from './menu';

import { Layout, Menu } from 'antd';

import styles from './index.less';

const { Sider, Content } = Layout;

function StorageCenter(props) {
  const [activeMenu, setActiveMenu] = useState(MENU_LIST[0]);

  return (
    <Layout className={styles.layout}>
      <Sider>
        <Menu
          className={classnames(styles.menu, 'dm-menu-default')}
          selectedKeys={[activeMenu.key]}
        >
          {MENU_LIST.map(m => {
            return (
              <Menu.Item key={m.key} onClick={() => setActiveMenu(m)}>
                {m.label}
              </Menu.Item>
            );
          })}
        </Menu>
      </Sider>
      <Content>{activeMenu.render()}</Content>
    </Layout>
  );
}

export default StorageCenter;

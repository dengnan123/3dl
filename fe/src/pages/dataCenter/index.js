import { useState } from 'react';
import { MENU_LIST } from './menu';

import { Layout, Menu } from 'antd';

import styles from './index.less';

const { Sider, Content } = Layout;

function ReleaseCenter(props) {
  const [activeMenu, setActiveMenu] = useState(MENU_LIST[0]);

  return (
    <Layout className={styles.releaseLayout}>
      <Sider>
        <Menu className={styles.menu} selectedKeys={[activeMenu.key]}>
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

export default ReleaseCenter;

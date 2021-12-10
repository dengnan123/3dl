import { Layout, Icon, Menu } from 'antd';
import React from 'react';
import router from 'umi/router';
import styles from './index.css';
import { menus } from '../components/GlobalSider/menu';
import 'antd/dist/antd.less';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const height = window.document.documentElement.clientHeight - 70;

function getMenus(menus) {
  const onSelect = v => {
    router.push(`/?compName=${v.key}`);
  };
  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      style={{ height: '100%', borderRight: 0, overflowX: 'hidden' }}
      onSelect={onSelect}
    >
      {menus.map(v => {
        const { key, label, child, icon } = v;
        return (
          <SubMenu
            title={
              <span>
                <Icon type={icon || 'user'} />
                {label}
              </span>
            }
            key={key}
          >
            {child.map(v => {
              const { label, compName, icon } = v;
              return (
                <Menu.Item key={compName}>
                  {icon}
                  {/* {compName}  */}
                  <span style={{ paddingLeft: 10 }}>{label}</span>
                </Menu.Item>
              );
            })}
          </SubMenu>
        );
      })}
    </Menu>
  );
}

function BasicLayout(props) {
  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
      </Header>

      <Layout style={{ height }}>
        <Sider width={200} style={{ background: '#fff' }}>
          {getMenus(menus)}
        </Sider>
        <Layout style={{ padding: '0 0px 0 20px' }}>
          <Content
            style={{
              background: '#fff',
              padding: 20,
              margin: 0,
              minHeight: 280,
            }}
            className={styles.normal}
          >
            {props.children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default BasicLayout;

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
// import { destoryGlobalSpinner } from '../../helpers/view';
import { Layout, ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import GlobalHeader from '../../components/GlobalHeader';
import GlobalSider from '../../components/GlobalSider';

import { notAdminMenuPath, queryParams } from '../../helpers/menu';
import styles from './index.less';

const { Content, Sider } = Layout;

function AuthRequiredLayout(props) {
  const { autoLogin, children, currentUser } = props;
  const { pathname, search } = window.location;
  const { tagIdList, pageIdList, isAdmin, feature } = currentUser || {};
  const { pageId, tagId } = queryParams(search) || {};

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    autoLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentUser || JSON.stringify(currentUser) === '{}') {
    return <div>系统鉴权中...</div>;
  }

  let childrenContent = children;

  const isHasTagPermission = tagIdList && tagIdList.includes(Number(tagId));
  const isHasPagePermission = !isHasTagPermission && pageIdList.includes(Number(pageId));
  const hasEditPermission = isHasTagPermission || isHasPagePermission;

  if (pathname === '/edit' && (hasEditPermission || isAdmin)) {
    return <div className={styles.normal}>{children}</div>;
  }

  if (!isAdmin && pathname === '/edit' && !hasEditPermission) {
    return <div className={styles.noPermission}>您没有该页面的编辑权限...</div>;
  }

  if (!isAdmin) {
    const menusPath = ['/', ...notAdminMenuPath(feature)];
    if (!menusPath.includes(pathname)) {
      childrenContent = <div className={styles.noPermission}>您没有该页面权限...</div>;
    }
  }

  if (pathname === '/comp-management/theme-edit') {
    return children;
  }

  return (
    <ConfigProvider locale={zhCN}>
      <Layout className={styles.layoutContainer}>
        <GlobalHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout>
          <Sider className={styles.sider} collapsed={collapsed}>
            <GlobalSider currentUser={currentUser} />
          </Sider>
          <Content style={{ padding: 15 }}>{childrenContent}</Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

AuthRequiredLayout.propTypes = {
  autoLogin: PropTypes.func,
  currentUser: PropTypes.object,
};

const mapStateToProps = ({ users }) => ({ currentUser: users.currentUser });

const mapDispatchToProps = dispatch => ({
  autoLogin: () => dispatch({ type: 'injected/autoLogin' }),
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthRequiredLayout);

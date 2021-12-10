import { connect } from 'dva';
import PropTypes from 'prop-types';
import { ALL_MENUS_TREE, notAdminMenu } from '../../helpers/menu';

import { Menu } from 'antd';

import { Link } from 'react-router-dom';

import styles from './index.less';

const GlobalSider = props => {
  const { locationPathname, currentUser } = props;
  const { isAdmin, feature } = currentUser || {};
  const menus = !isAdmin ? notAdminMenu(feature) : ALL_MENUS_TREE;

  const renderMenu = menus => {
    return menus.map(item => {
      if (!!item?.children?.length) {
        return (
          <Menu.SubMenu
            key={item.path}
            title={
              <>
                {item.icon && <i className={styles.icon}>{item.icon}</i>}
                {item.name}
              </>
            }
          >
            {renderMenu(item.children)}
          </Menu.SubMenu>
        );
      }
      return (
        <Menu.Item key={item.path}>
          {item.icon && <i className={styles.icon}>{item.icon}</i>}
          <Link to={item.path}>{item.name}</Link>
        </Menu.Item>
      );
    });
  };

  return (
    <Menu selectedKeys={[locationPathname]} className={styles.menu} mode="inline">
      {renderMenu(menus)}
    </Menu>
  );
};

GlobalSider.propTypes = {
  locationPathname: PropTypes.string,
};

const mapStateToProps = ({ app }) => ({ locationPathname: app.locationPathname });

export default connect(mapStateToProps)(GlobalSider);

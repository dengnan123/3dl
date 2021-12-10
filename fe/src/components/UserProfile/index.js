import { connect } from 'dva';
import PropTypes from 'prop-types';

import { Popover } from 'antd';

import styles from './index.less';

const UserProfile = props => {
  const { logout, currentUser } = props;
  const { userName } = currentUser || {};
  const firstCap = userName[0] ? userName[0] : 'A';

  return (
    <div className={styles.container}>
      <Popover
        trigger="click"
        placement="bottomRight"
        content={
          <div className={styles.popoverItem} onClick={logout}>
            注销
          </div>
        }
        getPopupContainer={triggerNode => triggerNode}
      >
        <div className={styles.userName}>{firstCap}</div>
      </Popover>
    </div>
  );
};

UserProfile.propTypes = {
  logout: PropTypes.func,
  currentUser: PropTypes.object,
};

const mapStateToProps = ({ users }) => ({ currentUser: users.currentUser });

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch({ type: 'users/logout' }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);

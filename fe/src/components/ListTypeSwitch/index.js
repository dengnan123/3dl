import { useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { ListTypeEnums } from './const';

import { ReactComponent as ListSwitchIcon } from '../../assets/svg/listSwitchIcon.svg';
import { ReactComponent as GridSwitchIcon } from '../../assets/svg/gridSwitchIcon.svg';

import styles from './index.less';

function ListTypeSwitch(props) {
  const { onChange, className, value } = props;

  const onSwitch = useCallback(
    type => {
      onChange && onChange(type);
    },
    [onChange],
  );

  return (
    <div className={classnames(styles.listSwitch, { [className]: className })}>
      {value === ListTypeEnums.list ? (
        <ListSwitchIcon onClick={() => onSwitch(ListTypeEnums.grid)} />
      ) : (
        <GridSwitchIcon onClick={() => onSwitch(ListTypeEnums.list)} />
      )}
    </div>
  );
}

ListTypeSwitch.defaultProps = {
  value: ListTypeEnums.list,
};

ListTypeSwitch.propTypes = {
  onChange: PropTypes.func,
  className: PropTypes.string,
  value: PropTypes.string,
};

ListTypeSwitch.ListTypeEnums = ListTypeEnums;

export default ListTypeSwitch;

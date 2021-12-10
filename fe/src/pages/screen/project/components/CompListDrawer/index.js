import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { Drawer, Table } from 'antd';

function CompListDrawer({ getCompListByTag, onChange, getCompListByTagLoading, visible, data }) {
  const [compList, setCompList] = useState([]);
  const requestIdRef = useRef();
  const tagId = data?.id;

  const handleClose = useCallback(() => {
    onChange && onChange({ compListDrawerVisible: false });
  }, [onChange]);

  useEffect(() => {
    if (!tagId || !visible) {
      setCompList([]);
      return;
    }
    const requestId = uuid();
    requestIdRef.current = requestId;
    getCompListByTag({ tagId }).then(data => {
      if (requestIdRef.current !== requestId) {
        return;
      }
      setCompList(data);
    });
  }, [getCompListByTag, tagId, visible]);

  const columns = useMemo(() => {
    return [
      {
        title: '组件名',
        dataIndex: 'compName',
      },
    ];
  }, []);

  return (
    <Drawer
      title={`${data?.name ?? ''}已使用组件`}
      width={760}
      visible={visible}
      onClose={handleClose}
    >
      <Table
        rowKey="id"
        columns={columns}
        dataSource={compList}
        loading={getCompListByTagLoading}
      />
    </Drawer>
  );
}

CompListDrawer.propTypes = {
  getCompListByTag: PropTypes.func,
  onChange: PropTypes.func,
  getCompListByTagLoading: PropTypes.bool,
  visible: PropTypes.bool,
  data: PropTypes.object,
};

const mapStateToProps = ({ loading }) => ({
  getCompListByTagLoading: loading.effects['project/getCompListByTag'],
});

const mapDispatchToProps = dispatch => ({
  getCompListByTag: payload => dispatch({ type: 'project/getCompListByTag', payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(CompListDrawer);

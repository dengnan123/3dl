import React, { useCallback } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import moment from 'dayjs';
import { Button, List } from 'antd';

function VersionsDrawerContent({ data }) {
  const list = [
    {
      id: 1,
      label: '版本-1',
      createTime: new Date().valueOf(),
    },
    {
      id: 2,
      label: '版本-2',
      createTime: new Date().valueOf(),
    },
  ];

  const handleDownload = useCallback(record => {
    console.log('下载', record);
  }, []);

  return (
    <List>
      {list.map(n => (
        <List.Item
          key={n.id}
          title={n.label}
          extra={
            <Button type="link" onClick={() => handleDownload(n)}>
              下载
            </Button>
          }
        >
          <List.Item.Meta
            title={n.createTime ? moment(+n.createTime).format('YYYY-MM-DD HH:mm:ss') : '--'}
            description={n.label}
          />
        </List.Item>
      ))}
    </List>
  );
}

VersionsDrawerContent.propTypes = {
  data: PropTypes.object,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(VersionsDrawerContent);

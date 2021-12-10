import { useCallback, useEffect, useState } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import moment from 'dayjs';
import { copyToClip } from '../../../../helpers/utils';

import { Button, Table, Card, Pagination, Upload, Spin } from 'antd';
import { ListTypeSwitch, GridList, PreviewModal } from '../../../../components/index';

import styles from './index.less';

const namespace_storagecenter = 'storageCenter';

const { ListTypeEnums } = ListTypeSwitch;

function getColumns() {
  return [
    {
      title: '文件名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '预览',
      dataIndex: 'preview',
      key: 'preview',
      width: 100,
      render: (text, record) => {
        const { poster, src } = record;
        return <PreviewModal className={styles.tableImg} type="video" src={src} poster={poster} />;
      },
    },
    {
      title: '路径',
      dataIndex: 'src',
      key: 'src',
      ellipsis: true,
      render: src => (
        <span style={{ cursor: 'pointer' }} onClick={() => copyToClip(src)}>
          {src}
        </span>
      ),
    },
    {
      title: '文件大小',
      dataIndex: 'size',
      key: 'size',
      width: 120,
    },
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
      key: 'uploadTime',
      width: 180,
      render: uploadTime => moment(uploadTime).format('YYYY/MM/DD HH:mm'),
    },
  ];
}

function sliceList(data, page, pageSize) {
  return (data || []).slice((page - 1) * pageSize, page * pageSize);
}

function VideoStorage(props) {
  const { getVideoList, videoList, fetchListLoading } = props;
  const [listType, setListType] = useState(ListTypeEnums.list);
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 12 });

  const onChange = useCallback(
    (page, pageSize) => {
      const d = sliceList(videoList, page, pageSize);
      setPagination({ current: page, pageSize });
      setDataSource(d);
    },
    [videoList],
  );

  const featchVideoList = useCallback(() => {
    const { current, pageSize } = pagination;

    getVideoList &&
      getVideoList().then(res => {
        const { errorCode, data } = res || {};
        if (errorCode === 200) {
          const d = sliceList(data, current, pageSize);
          setDataSource(d);
        }
      });
  }, [getVideoList, pagination]);

  const onUploadChange = useCallback(info => {
    console.log('status', info.file.status);
    console.log('file', info.file);
    console.log('file.percent', info.percent);
    console.log('fileList', info.fileList);
  }, []);

  useEffect(() => {
    featchVideoList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <span className={styles.label}>文件存储路径：{'c:\\files\\2020'}</span>
        <Upload
          className={styles.upload}
          name="video"
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          headers={{ authorization: 'authorization-text' }}
          accept="video/*"
          showUploadList={false}
          onChange={onUploadChange}
        >
          <Button type="primary">上传视频</Button>
        </Upload>
      </div>
      <div className={styles.desc}>
        <span className={styles.total}>
          共<span>{(videoList || []).length}</span>条
        </span>
        <ListTypeSwitch className={styles.switch} value={listType} onChange={setListType} />
      </div>

      {listType === ListTypeEnums.list ? (
        <Table
          className="dm-table-primary"
          rowKey="id"
          dataSource={dataSource}
          columns={getColumns()}
          pagination={false}
          loading={fetchListLoading}
        />
      ) : (
        <Spin spinning={fetchListLoading}>
          <GridList
            dataSource={dataSource}
            renderItem={n => {
              const { name, size, src, poster, uploadTime } = n;

              return (
                <Card
                  className={styles.card}
                  cover={
                    <PreviewModal
                      className={styles.corverImg}
                      type="video"
                      src={src}
                      poster={poster}
                    />
                  }
                  hoverable={true}
                >
                  <span className={styles.size}>{size}</span>
                  <h4>{name}</h4>
                  <p>{moment(uploadTime).format('YYYY/MM/DD HH:mm')}</p>

                  <p style={{ cursor: 'pointer' }} onClick={() => copyToClip(src)}>
                    {src}
                  </p>
                </Card>
              );
            }}
          />
        </Spin>
      )}

      <Pagination
        className="dm-pagination-default"
        current={pagination.current}
        pageSize={pagination.pageSize}
        showQuickJumper={true}
        showSizeChanger={true}
        pageSizeOptions={['12', '24', '36', '48']}
        onChange={onChange}
        onShowSizeChange={onChange}
        total={(videoList || []).length}
      />
    </div>
  );
}

VideoStorage.propTypes = {
  getVideoList: PropTypes.func,
  videoList: PropTypes.array,
  fetchListLoading: PropTypes.bool,
};

const mapStateToProps = ({ storageCenter, loading }) => ({
  videoList: storageCenter.videoList,
  fetchListLoading: loading.effects[`${namespace_storagecenter}/getVideoList`],
});

const mapDispatchToProps = dispatch => ({
  getVideoList: () => dispatch({ type: `${namespace_storagecenter}/getVideoList` }),
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoStorage);

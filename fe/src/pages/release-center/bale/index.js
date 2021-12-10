import { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { useUpdateState } from '@/hooks/index';
import { Button, Layout, Table, Drawer } from 'antd';
import { BuildForm, VersionsDrawerContent } from './components/index';
import { SearchWidthTable } from '@/components/index';
import { tagColumns, pageColumns } from './const';
import styles from './index.less';

const { Header, Content } = Layout;

const namespace_bale = 'bale';

function Bale(props) {
  const {
    updateState,
    buildPage,
    getTagList,
    getPageList,
    getRepaceJsonConfigList,
    getStartShList,
    tagList,
    repaceJsonConfigList,
    startShList,
    buildPageLoading,
    tagListLoading,
    pageListLoading,
  } = props;
  const [vis, setState] = useState(false);
  const [{ versionDrawerVisible, selectedRowData }, updateCurrentState] = useUpdateState({
    versionDrawerVisible: false,
    selectedRowData: null,
  });

  const [clickTagRowKey, setClickTagRowKey] = useState();
  const [selectedTagRowKeys, setSelectedTagRowKeys] = useState([]);
  const [selectedTagInfo, setSelectedTagInfo] = useState({});
  const [selectedPageRowKeys, setSelectedPageRowKeys] = useState([]);

  useEffect(() => {
    getTagList && getTagList({ pageSize: 999 });
    getRepaceJsonConfigList && getRepaceJsonConfigList();
    getStartShList && getStartShList();
  }, [getTagList, getRepaceJsonConfigList, getStartShList]);

  const handlePageSelect = useCallback(
    (record, selected, selectedRows) => {
      if (!!selectedRows.length) {
        const { tagId } = selectedRows[0];
        const tagInfo = tagList.find(i => i.id === tagId) || {};
        setSelectedTagRowKeys([tagId]);
        setSelectedTagInfo(tagInfo);
      } else {
        setSelectedTagRowKeys([]);
        setSelectedTagInfo({});
      }
      const keys = selectedRows.map(n => n.id);
      setSelectedPageRowKeys(keys);
    },
    [tagList],
  );

  /**
   * 项目选择
   */
  const handleTagSelect = useCallback(
    (record, selected) => {
      const { id, pageList } = record;

      const selectedPageRowKeys = (pageList || []).map(n => n.id);
      const selectedTagRowKeys = selected ? [record.id] : [];
      setSelectedPageRowKeys(selected ? selectedPageRowKeys : []);
      setSelectedTagRowKeys(selectedTagRowKeys);
      setSelectedTagInfo(selected ? record : {});
      // 如果没有展开过项目，那么需要获取当前项目下的pageList
      if (selected && !pageList) {
        getPageList({ tagId: id, current: 1, pageSize: 999 }).then(data => {
          const list = data?.list || [];
          const _tags = (tagList || []).map(n => {
            if (n.id === id) {
              n.pageList = list;
            }
            return n;
          });
          const keys = list.map(n => n.id);
          updateState({ tagList: _tags });
          setSelectedPageRowKeys(keys);
        });
      }
    },
    [getPageList, tagList, updateState, setSelectedPageRowKeys],
  );

  /**
   * 项目展开
   */
  const onExpand = useCallback(
    (expanded, record) => {
      const { id, pageList } = record;
      if (expanded && !pageList?.length) {
        getPageList({ tagId: id, current: 1, pageSize: 999 }).then(data => {
          const list = data?.list || [];
          const _tags = (tagList || []).map(n => {
            if (n.id === id) {
              n.pageList = list;
            }
            return n;
          });
          const keys = list.map(n => n.id);
          updateState({ tagList: _tags });
          if (selectedTagRowKeys.length && selectedTagRowKeys[0] === id) {
            setSelectedPageRowKeys(keys);
          }
        });
      }
      setClickTagRowKey(expanded ? id : undefined);
    },
    [updateState, getPageList, tagList, selectedTagRowKeys],
  );

  const finalTagColumns = useMemo(() => {
    return [
      ...tagColumns,
      {
        title: '历史版本',
        dataIndex: 'version',
        width: 120,
        render: (text, record) => (
          <Button
            type="link"
            style={{ padding: 0 }}
            onClick={() =>
              updateCurrentState({ versionDrawerVisible: true, selectedRowData: record })
            }
          >
            查看
          </Button>
        ),
      },
    ];
  }, [updateCurrentState]);

  const buildForm = {
    tagId: selectedTagRowKeys[0],
    tagInfo: selectedTagInfo,
    vis,
    repaceJsonConfigList,
    startShList,
    onCancel() {
      setState(false);
    },
    onOk(v) {
      handleBale(v);
    },
    buildPageLoading,
  };

  // 打包
  const handleBale = useCallback(
    (v = {}) => {
      const {
        envId,
        startShId,
        replaceJsonId,
        branch,
        depyType,
        gitPush,
        gitConfig,
        serverDeploy,
        serverConfig,
      } = v;
      const startShJson = startShList?.find(n => n.id === startShId)?.json;
      const replaceJson = repaceJsonConfigList?.find(n => n.id === replaceJsonId)?.replaceJson;
      const tagId = selectedTagRowKeys[0];
      const pageIdList = selectedPageRowKeys;
      const finalReplaceJson = {};
      const finalStartShJson = {};

      if (replaceJson) {
        replaceJson.forEach(m => {
          finalReplaceJson[m.key] = m.value;
        });
      }
      if (startShJson) {
        startShJson.forEach(m => {
          finalStartShJson[m.key] = m.value;
        });
      }

      let newDepType = depyType;

      if (newDepType === 'electronDist') {
        finalReplaceJson.ELE_LOCAL_DEP = 'true'; // 设置为 ele 打包
        newDepType = 'dist';
      }
      if (newDepType === 'dist') {
        const base = 'UMI_';
        const routerBase = `${base}ROUTER_BASE`;
        const publicPath = `${base}PUBLIC_PATH`;
        if (finalReplaceJson.nginxPath) {
          const nginxPath = finalReplaceJson.nginxPath.replace(/(^\s*)|(\s*$)/g, '');
          finalReplaceJson[routerBase] = nginxPath;
          finalReplaceJson[publicPath] = nginxPath;
        } else {
          finalReplaceJson[routerBase] = '/';
          finalReplaceJson[publicPath] = '';
        }
      }

      const buildData = {
        pageIdList,
        replaceJson: finalReplaceJson,
        tagId,
        envId,
        json: finalStartShJson,
        branch,
        depyType: newDepType,
        gitPush,
        gitConfig,
        serverDeploy,
        serverConfig,
      };
      console.log('buildDatabuildData', buildData);
      buildPage(buildData);
    },
    [selectedPageRowKeys, selectedTagRowKeys, buildPage, repaceJsonConfigList, startShList],
  );

  /**
   * 项目
   */
  const tagRowSelection = useMemo(() => {
    return {
      selectedRowKeys: selectedTagRowKeys,
      onSelect: handleTagSelect,
    };
  }, [selectedTagRowKeys, handleTagSelect]);

  /**
   * 页面
   */
  const pageRowSelection = useMemo(() => {
    return {
      selectedRowKeys: selectedPageRowKeys,
      onSelect: handlePageSelect,
    };
  }, [selectedPageRowKeys, handlePageSelect]);

  /**
   * 项目展开渲染
   */
  const expandedRowRender = useCallback(
    record => {
      const { id, pageList } = record;
      const loading = clickTagRowKey === id && pageListLoading;
      return (
        <Table
          rowKey="id"
          bordered={false}
          showHeader={false}
          columns={pageColumns}
          dataSource={pageList}
          pagination={false}
          rowSelection={pageRowSelection}
          loading={loading}
        />
      );
    },
    [pageRowSelection, clickTagRowKey, pageListLoading],
  );

  return (
    <>
      <Layout className={styles.container}>
        <Header>
          <Button
            type="primary"
            disabled={!selectedTagRowKeys.length}
            loading={buildPageLoading}
            onClick={() => setState(true)}
          >
            一键打包
          </Button>
        </Header>
        <Content>
          <SearchWidthTable
            title="项目列表："
            searchKeys={['id', 'name']}
            searchOtherProps={{ placeholder: '项目id，名称' }}
            getTotal={total => (
              <p className={styles.total}>
                已选择<span>{selectedPageRowKeys.length}</span>条
              </p>
            )}
            dataSource={tagList}
            columns={finalTagColumns}
            listLoading={tagListLoading}
            tableOtherProps={{
              expandedRowRender,
              rowSelection: tagRowSelection,
              onExpand,
              indentSize: 25,
              pagination: {},
            }}
          />

          {vis && <BuildForm {...buildForm}></BuildForm>}
        </Content>
      </Layout>
      <Drawer
        title="历史版本下载"
        visible={versionDrawerVisible}
        width={560}
        onClose={() => updateCurrentState({ versionDrawerVisible: false })}
      >
        <VersionsDrawerContent data={selectedRowData} />
      </Drawer>
    </>
  );
}

Bale.propTypes = {
  updateState: PropTypes.func,
  getTagList: PropTypes.func,
  getPageList: PropTypes.func,
  getRepaceJsonConfigList: PropTypes.func,
  getStartShList: PropTypes.func,
  buildPage: PropTypes.func,
  buildPageLoading: PropTypes.bool,
  tagListLoading: PropTypes.bool,
  pageListLoading: PropTypes.bool,
  repaceJsonConfigListLoading: PropTypes.bool,
  tagList: PropTypes.array,
  pageList: PropTypes.array,
  repaceJsonConfigList: PropTypes.array,
};

const mapStateToProps = ({ loading, bale }) => ({
  buildPageLoading: loading.effects[`${namespace_bale}/buildPage`],
  tagListLoading: loading.effects[`${namespace_bale}/getTagList`],
  pageListLoading: loading.effects[`${namespace_bale}/getPageList`],
  repaceJsonConfigListLoading: loading.effects[`${namespace_bale}/getRepaceJsonConfigList`],
  tagList: bale.tagList,
  pageList: bale.pageList,
  repaceJsonConfigList: bale.repaceJsonConfigList,
  startShList: bale.startShList,
});

const mapDispatchToProps = dispatch => ({
  updateState: payload => dispatch({ type: `${namespace_bale}/updateState`, payload }),
  getTagList: payload => dispatch({ type: `${namespace_bale}/getTagList`, payload }),
  getPageList: payload => dispatch({ type: `${namespace_bale}/getPageList`, payload }),
  getRepaceJsonConfigList: () => dispatch({ type: `${namespace_bale}/getRepaceJsonConfigList` }),
  getStartShList: () => dispatch({ type: `${namespace_bale}/getStartShList` }),
  buildPage: payload => dispatch({ type: `${namespace_bale}/buildPage`, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Bale);

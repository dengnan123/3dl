import { useState, useCallback, useMemo, useEffect } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { useDebounce } from '@react-hook/debounce';
import { Input, Card, Button, Layout, Row, Col, Icon, Popconfirm, Tooltip } from 'antd';
import { ReplaceJsonConfigModal } from './components/index';

import styles from './index.less';

const { Header, Content } = Layout;
const { Search } = Input;

const namespace_env_config = 'envConfig';

function EnvConfig(props) {
  const { getRepaceJsonConfigList, deleteReplaceConfig, repaceJsonConfigList } = props;
  const [visible, setVisible] = useState(false);
  const [activeData, setActiveData] = useState();
  const [keywords, setKeywords] = useDebounce(undefined, 800);

  useEffect(() => {
    getRepaceJsonConfigList && getRepaceJsonConfigList();
  }, [getRepaceJsonConfigList]);

  const handleModalOpen = useCallback(current => {
    setActiveData(current);
    setVisible(true);
  }, []);

  const handleDelete = useCallback(
    current => {
      deleteReplaceConfig({ ...current, status: 0 });
    },
    [deleteReplaceConfig],
  );

  const handleSearch = useCallback(
    e => {
      const value = e.target.value;
      setKeywords(value);
    },
    [setKeywords],
  );

  const { finalReplaceJsonConfigList } = useMemo(() => {
    const finalReplaceJsonConfigList = repaceJsonConfigList.filter(item =>
      `${item.id}${item.name}`.toLowerCase().includes((keywords || '').trim().toLowerCase()),
    );
    return { finalReplaceJsonConfigList };
  }, [repaceJsonConfigList, keywords]);

  return (
    <Layout className={styles.container}>
      <Header>
        <Search placeholder="搜索配置" style={{ width: 400 }} onChange={handleSearch} />

        <Button type="primary" onClick={() => handleModalOpen()}>
          添加
        </Button>

        <p className={styles.total}>
          总共<span>{finalReplaceJsonConfigList.length}</span>条配置
        </p>
      </Header>
      <Content>
        <Row gutter={[10, 10]}>
          {finalReplaceJsonConfigList.map((n, index) => {
            const { id, name, replaceJson } = n;
            return (
              <Col key={id} span={6}>
                <Card
                  bodyStyle={{ overflow: 'hidden', height: 150, overflowY: 'scroll' }}
                  title={name}
                  extra={
                    <>
                      <Icon
                        type="edit"
                        theme="twoTone"
                        onClick={() => handleModalOpen(n)}
                        style={{ marginRight: 10 }}
                      />
                      <Popconfirm
                        placement="top"
                        title="确定要删除吗"
                        onConfirm={() => handleDelete(n)}
                        okText="确定"
                        cancelText="取消"
                      >
                        <Icon type="delete" theme="twoTone" />
                      </Popconfirm>
                    </>
                  }
                >
                  <Row>
                    <Col span={12} style={{ textAlign: 'center', borderRight: '1px solid #000' }}>
                      替换前
                    </Col>
                    <Col span={12} style={{ textAlign: 'center' }}>
                      替换后
                    </Col>
                  </Row>
                  {replaceJson?.map((m, index) => {
                    return (
                      <Row key={index}>
                        <Col
                          span={12}
                          className={styles.overflow}
                          style={{ borderRight: '1px solid' }}
                        >
                          <Tooltip title={m.key}>
                            <span>{m.key}</span>
                          </Tooltip>
                        </Col>
                        <Col span={12} className={styles.overflow}>
                          <Tooltip title={m.value}>
                            <span>{m.value}</span>
                          </Tooltip>
                        </Col>
                      </Row>
                    );
                  })}
                </Card>
              </Col>
            );
          })}
        </Row>
      </Content>

      <ReplaceJsonConfigModal activeData={activeData} visible={visible} setVisible={setVisible} />
    </Layout>
  );
}

EnvConfig.propTypes = {
  getRepaceJsonConfigList: PropTypes.func,
  deleteReplaceConfig: PropTypes.func,
  repaceJsonConfigList: PropTypes.array,
  currentUser: PropTypes.object,
};

const mapStateToProps = ({ envConfig }) => ({
  repaceJsonConfigList: envConfig.repaceJsonConfigList,
});

const mapDispatchToProps = dispatch => ({
  getRepaceJsonConfigList: payload =>
    dispatch({ type: `${namespace_env_config}/getRepaceJsonConfigList`, payload }),
  deleteReplaceConfig: payload =>
    dispatch({ type: `${namespace_env_config}/deleteReplaceConfig`, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(EnvConfig);

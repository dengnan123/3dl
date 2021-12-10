import React, { useMemo, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { getCompStaticData } from '@/helpers/screen';
import { Collapse, Row, Col, Card, Icon, Select, Button } from 'antd';

import NoPicture from '@/assets/no-pic.png';

import styles from './index.less';
import { API_HOST } from '@/config';
const { Panel } = Collapse;
const { Meta } = Card;

const namespace_theme_edit = 'themeEdit';

const CompList = props => {
  const { getPluginMenu, onSelect, compMenuList = [], compMenuListLoading } = props;

  useEffect(() => {
    getPluginMenu();
  }, [getPluginMenu]);
  const [selected, setSelected] = useState([]);

  const onClick = useCallback(
    async value => {
      const { compName } = value;
      const mockData = (await getCompStaticData(compName)) || {};
      onSelect && onSelect(value, mockData);
    },
    [onSelect],
  );

  const onChange = useCallback(n => {
    setSelected(n ? [JSON.parse(n)] : []);
  }, []);

  const allCompList = useMemo(() => {
    return (compMenuList || []).reduce((a, b) => {
      if (Array.isArray(a)) {
        return [...a, ...b.child];
      }
      return [...a.child, ...b.child];
    }, []);
  }, [compMenuList]);

  const renderItem = arr => {
    return (
      <Row gutter={[10, 0]} className={styles.renderItem}>
        {arr?.map(v => {
          const { label, compName, pluginImageSrc } = v;
          let src = `${API_HOST}/static/plugin/${pluginImageSrc}`;
          if (!pluginImageSrc) {
            src = NoPicture;
          }
          return (
            <Col key={`${label}${compName}`} span={12} className={styles.silderItem}>
              <Card
                hoverable={true}
                onClick={() => onClick(v)}
                cover={<img alt="comp img" src={src || getImgSrc()} />}
              >
                <Meta description={label} />
              </Card>
            </Col>
          );
        })}
      </Row>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.search}>
        <Select
          placeholder="查找对应组件"
          showSearch={true}
          allowClear={true}
          onChange={onChange}
          filterOption={(input, option) =>
            option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          style={{ width: 'calc(100% - 45px)' }}
          getPopupContainer={triggerNode => triggerNode}
        >
          {allCompList.map(n => {
            const { label } = n;
            return (
              <Select.Option key={JSON.stringify(n)} value={JSON.stringify(n)}>
                {label}
              </Select.Option>
            );
          })}
        </Select>
        {!compMenuListLoading ? (
          <Button type="link" onClick={getPluginMenu} className={styles.refresh}>
            <Icon type="sync" />
          </Button>
        ) : (
          <Icon type="loading" style={{ color: '#1991eb', marginLeft: 17, fontSize: '18px' }} />
        )}
      </div>
      <div className={styles.scrollContent}>
        {selected.length ? (
          renderItem(selected)
        ) : (
          <Collapse expandIconPosition="right" defaultActiveKey={['10', '11']}>
            {compMenuList.map(v => {
              const { key, label, child } = v;
              return (
                <Panel
                  key={key}
                  header={
                    <>
                      <Icon type="appstore" style={{ marginRight: 5 }} />
                      {label}
                    </>
                  }
                >
                  {renderItem(child)}
                </Panel>
              );
            })}
          </Collapse>
        )}
      </div>
    </div>
  );
};

CompList.propTypes = {
  getPluginMenu: PropTypes.func,
  onSelect: PropTypes.func,
  compMenuList: PropTypes.array,
  compMenuListLoading: PropTypes.bool,
};

const mapStateToProps = ({ themeEdit, loading }) => ({
  compMenuList: themeEdit.compMenuList,
  compMenuListLoading: loading.effects[`${namespace_theme_edit}/getPluginMenu`],
});

const mapDispatchToProps = dispatch => ({
  getPluginMenu: payload => dispatch({ type: `${namespace_theme_edit}/getPluginMenu`, payload }),
});

export default connect(mapStateToProps, mapDispatchToProps)(CompList);

function getImgSrc() {
  return 'data:image/png;base64,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';
}

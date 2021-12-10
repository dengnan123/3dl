import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Empty, Spin } from 'antd';

import styles from './index.less';

const colSpan = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 12 },
  lg: { span: 6 },
  xl: { span: 6 },
  xxl: { span: 4 },
};

function GridList(props) {
  const { renderItem, rowProps, colProps, dataSource, loading = false } = props;

  if (!loading && (!dataSource || !dataSource.length)) {
    return <Empty />;
  }
  return (
    <Spin spinning={loading} wrapperClassName={styles.spinning}>
      <Row gutter={[10, 10]} {...rowProps}>
        {(dataSource || []).map((n, index) => {
          return (
            <Col key={n.id || index} {...colSpan} {...colProps}>
              {renderItem ? renderItem(n, index) : null}
            </Col>
          );
        })}
      </Row>
    </Spin>
  );
}

GridList.propTypes = {
  renderItem: PropTypes.func,
  rowProps: PropTypes.object,
  colProps: PropTypes.object,
  dataSource: PropTypes.array,
  loading: PropTypes.bool,
};

export default GridList;

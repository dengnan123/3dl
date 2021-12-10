import React, { Component } from 'react';
import PropTypes from 'prop-types';
import querystring from 'query-string';
import styles from './index.less';

// import { destoryGlobalSpinner } from '../helpers/view';

class OpenPageLayout extends Component {
  componentWillMount() {
    const keys = [
      'propertyPointId',
      'partitionId',
      'provinceName',
      'cityName',
      'districtName',
      'communityName',
    ];

    const { query } = querystring.parseUrl(window.location.href);

    keys.map(key => {
      const value = decodeURI(query[key] || '');
      window.localStorage.setItem(key, value);
      return key;
    });
  }

  render() {
    const { children } = this.props;
    const { pathname } = window.location;

    // destoryGlobalSpinner();
    if (pathname === '/preview') {
      return <div className={styles.pre}>{children}</div>;
    }

    return <React.Fragment>{children}</React.Fragment>;
  }
}

OpenPageLayout.propTypes = {
  children: PropTypes.any,
};

export default OpenPageLayout;

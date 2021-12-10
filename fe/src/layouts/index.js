import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import Redirect from 'umi/redirect';
import { destoryGlobalSpinner } from '../helpers/view';
// import NProgress from 'nprogress';
import ErrorDiv from '@/components/ErrorDiv';
import pathToRegexp from 'path-to-regexp';
import OpenPageLayout from './OpenPageLayout';
import AuthRequiredLayout from './AuthRequiredLayout';
import { isOpenPages } from '../helpers/env';
// import * as Sentry from '@sentry/react';
import { windowUtil } from '@/helpers/windowUtil';
import { addVconsole } from '@/runtimePlugins/didMount';
import Helmet from 'react-helmet';

import './index.less';

class Layout extends React.Component {
  state = {
    hasError: false,
  };

  componentDidMount() {
    // Sentry.init({
    //   dsn: 'https://dbc3b27b23fd4ef5b6bb38370f3b5db9@o419482.ingest.sentry.io/5463068',
    // });
    window.onerror = error => {
      console.log(' window.onerror', error);
      this.setState({
        hasError: true,
      });
      // Sentry.captureException(error);
    };
    windowUtil();
    addVconsole();
  }

  // componentDidUpdate() {
  //   const {
  //     location: { pathname },
  //     preview,
  //   } = this.props;
  //   if (pathname === '/preview') {
  //     const { initUseCompList } = preview;
  //     if (initUseCompList?.length) {
  //       setTimeout(() => {
  //         destoryGlobalSpinner();
  //       }, 200);
  //     }
  //   }
  // }

  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器
    console.log('componentDidCatch........', error, errorInfo);
    this.setState({
      hasError: true,
    });
    // Sentry.captureException(error);
  }
  render() {
    const { location, route, children, title } = this.props;
    const { hasError } = this.state;

    // if (location.pathname !== '/preview') {
    //   destoryGlobalSpinner();
    // }

    destoryGlobalSpinner();

    if (hasError) {
      return <ErrorDiv></ErrorDiv>;
    }

    const renderContent = () => {
      if (isOpenPages(location.pathname)) {
        return <OpenPageLayout>{children}</OpenPageLayout>;
      }
      if (checkIfPageExist(route, location)) {
        return <AuthRequiredLayout>{children}</AuthRequiredLayout>;
      }
      return (
        <Redirect
          to={{
            pathname: '/o/404',
            search: `?from=${encodeURIComponent(location.pathname)}`,
          }}
        />
      );
    };
    return (
      <Fragment>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        {renderContent()}
      </Fragment>
    );
  }
}

Layout.propTypes = {
  loading: PropTypes.object,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }),
  route: PropTypes.any,
  children: PropTypes.any,
};

export default connect(({ loading, preview }) => {
  return {
    loading,
    preview,
    title: preview?.pageConfig?.name || '3DL',
  };
})(Layout);

const availableRouteMatcher = [];

function checkIfPageExist(route, location) {
  if (!route || !route.routes) {
    return false;
  }

  const { pathname } = location;

  if (!availableRouteMatcher.length) {
    const routes = route.routes.map(r => r.path).filter(r => !!r);
    availableRouteMatcher.push(...routes.map(r => pathToRegexp(r)));
  }

  return availableRouteMatcher.some(m => m.exec(pathname));
}

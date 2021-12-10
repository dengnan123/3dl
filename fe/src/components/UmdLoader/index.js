import React, { useEffect, useState, useCallback } from 'react';
import script from 'scriptjs';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import echarts from 'echarts';
import RcSteps from 'rc-steps';
// import moment from 'moment';
// import * as antd from 'antd';

window.PropTypes = PropTypes;
window.echarts = echarts;
window.RcSteps = RcSteps;
window.React = React;
window.ReactDom = ReactDom;
const LoadUmd = props => {
  const { url, name, compName } = props;
  const [state, setState] = useState({ Component: null, error: null });
  const loaderScript = useCallback((url, name) => {
    script(url, () => {
      const target = window[name];
      if (target) {
        // loaded OK
        setState({
          error: null,
          Component: target.default ? target.default : target,
        });
      } else {
        // loaded fail
        setState({
          error: `Cannot load component ${name} at ${url}`,
          Component: null,
        });
      }
    });
  }, []);

  const loaderScreenLib = useCallback(compName => {
    const target = window.ScreenLib.default || window.ScreenLib;
    if (target && target[compName]) {
      setState({
        error: null,
        Component: target[compName],
      });
    } else {
      setState({
        error: `Cannot load component ${compName} `,
        Component: null,
      });
    }
  }, []);

  useEffect(() => {
    const { ScreenLib } = window;
    if (ScreenLib) {
      loaderScreenLib(compName);
      return;
    }
    loaderScript(url, name);
  }, [name, compName, url, loaderScreenLib, loaderScript]);

  if (state.Component) {
    return <state.Component {...props} />;
  }
  if (state.error) {
    return <div>{state.error}</div>;
  }
  return props.children;
};

export default LoadUmd;

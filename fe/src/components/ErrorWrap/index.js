import React from 'react';

export default class ErrorWrap extends React.Component {
  state = {
    hasError: false,
    errorMsg: '',
  };
  componentDidMount() {
    // Sentry.init({
    //   dsn: 'https://2619860ff5174353bf70878de962156b@o419482.ingest.sentry.io/5333379',
    //   debug: true,
    // });
    window.onerror = error => {
      console.log('window.onerror........', error);
      console.log('window.onerror........', error.message);
      this.setState({
        hasError: true,
        errorMsg: error.message,
      });
      // Sentry.captureException(error);
    };
  }
  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器
    console.log('componentDidCatch', error, errorInfo);
    console.log('componentDidCatch---error-msg', error.message);
    this.setState({
      hasError: true,
      errorMsg: error.message,
    });
    // Sentry.captureException(error);
  }
  render() {
    const { hasError } = this.state;
    if (hasError) {
      return (
        <div>
          {/* 组件渲染报错
          {JSON.stringify(errorMsg)} */}
        </div>
      );
    }
    return this.props.children;
  }
}

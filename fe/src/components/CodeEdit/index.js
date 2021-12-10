import React from 'react';
import { Button, notification } from 'antd';
import MonacoEditor from 'react-monaco-editor';

class AnotherEditor extends React.Component {
  constructor(props) {
    super();
    this.state = {
      code: '{}',
      language: 'json',
      isError: false,
    };
  }

  componentDidMount() {
    const { code: propsCode } = this.props;
    console.log('componentDidMount', propsCode);
    this.setState({
      code: JSON.stringify(propsCode, null, 2),
    });
  }

  // componentDidUpdate() {
  //   const { code } = this.state;
  //   const { code: propsCode } = this.props;
  //   const newCode = JSON.stringify(propsCode, null, 2);
  //   if (newCode !== code) {
  //     // console.log('propsCode', propsCode);
  //     // console.log('codecode', code);
  //     console.log('更新');
  //     this.updateState({
  //       code: newCode,
  //     });
  //   }
  // }

  updateState = data => {
    this.setState(data);
  };

  editorWillMount = monaco => {
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [
        {
          uri: 'http://myserver/foo-schema.json',
          schema: {
            type: 'object',
            properties: {
              p1: {
                enum: ['v1', 'v2'],
              },
              p2: {
                $ref: 'http://myserver/bar-schema.json',
              },
            },
          },
        },
        {
          uri: 'http://myserver/bar-schema.json',
          schema: {
            type: 'object',
            properties: {
              q1: {
                enum: ['x1', 'x2'],
              },
            },
          },
        },
      ],
    });
  };

  btnClick = () => {
    const { code } = this.state;
    const { update } = this.props;
    let isError = false;
    let obj = {};
    try {
      obj = JSON.parse(code);
    } catch (err) {
      isError = true;
    }
    if (isError) {
      notification.open({
        message: 'Error',
        description: 'json格式有误',
      });
      return;
    }
    update(obj);
  };

  onChange = (newValue, event) => {
    const { disCode } = this.props;
    if (disCode) {
      return;
    }
    this.setState({
      code: newValue,
    });
  };
  render() {
    const { code } = this.state;
    const { disCode, language } = this.props;

    return (
      <div>
        <MonacoEditor
          width="800"
          height="700"
          language={language}
          value={code}
          editorWillMount={this.editorWillMount}
          onChange={this.onChange}
        />
        {!disCode && (
          <Button onClick={this.btnClick} type="primary">
            提交
          </Button>
        )}
      </div>
    );
  }
}

export default AnotherEditor;

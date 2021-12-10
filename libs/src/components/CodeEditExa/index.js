import React from 'react';
import { Button, notification } from 'antd';
import MonacoEditor from 'react-monaco-editor';
// import * as traQ from 'to-double-quotes';

class AnotherEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '{}',
      isError: false,
    };
  }

  componentDidMount() {
    const { code: propsCode } = this.props;
    this.setState({
      code: JSON.stringify(propsCode, null, 2),
    });
  }

  // componentDidUpdate() {
  //   const { code } = this.state;
  //   const { code: propsCode } = this.props;
  //   const newCode = JSON.stringify(propsCode, null, 2);
  //   if (newCode !== code) {
  //     this.updateState({
  //       code: newCode,
  //     });
  //   }
  // }

  updateState = data => {
    this.setState(data);
  };

  editorWillMount = monaco => {
    monaco.languages.json &&
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
      // const _code = traQ(code);
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
    if (disCode) return;
    this.setState({ code: newValue });
  };
  render() {
    const { code } = this.state;
    const { disCode } = this.props;

    return (
      <div>
        <MonacoEditor
          width="100%"
          height="700"
          language="json"
          theme="vs-dark"
          value={code}
          editorWillMount={this.editorWillMount}
          onChange={this.onChange}
        />
        {!disCode && (
          <Button onClick={this.btnClick} type="primary" style={{ marginTop: 20 }}>
            提交
          </Button>
        )}
      </div>
    );
  }
}

export default AnotherEditor;

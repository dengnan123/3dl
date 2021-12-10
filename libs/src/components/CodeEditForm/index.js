import React from 'react';
import { Button, notification } from 'antd';
import MonacoEditor from 'react-monaco-editor';

class CodeEditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '{}',
      isError: false,
    };
  }

  componentDidMount() {
    const { value: propsCode } = this.props;
    this.setState({
      value: JSON.stringify(propsCode, null, 2),
    });
  }

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

  onChange = (newValue, event) => {
    const { onChange } = this.props;
    let isError = false;
    let obj = {};
    this.setState({ value: newValue });
    try {
      // const _code = traQ(code);
      console.log(newValue);
      obj = JSON.parse(newValue);
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
    onChange(obj);
  };
  render() {
    const { value } = this.state;
    return (
      <div>
        <MonacoEditor
          width="100%"
          height="700"
          language="json"
          theme="vs-dark"
          value={value}
          editorWillMount={this.editorWillMount}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

export default CodeEditForm;

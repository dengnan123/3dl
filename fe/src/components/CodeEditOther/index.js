import React from 'react';
import { Button } from 'antd';
import MonacoEditor from 'react-monaco-editor';
import screenfull from 'screenfull';
import * as uuid from 'uuid';
// import moment from 'dayjs'

class AnotherEditor extends React.Component {
  constructor(props) {
    super();
    this.state = {
      code: '{}',
      language: 'json',
      isError: false,
      width: props.width || 800,
      height: props.height || 700,
      id: `${uuid.v4()}`,
    };
  }

  editorWillMount = monaco => {
    try {
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
    } catch (err) {
      console.log('eerrer', err);
    }
  };

  onChange = (newValue, event) => {
    const { disCode, onChange } = this.props;
    if (disCode) {
      return;
    }
    onChange && onChange(newValue);
  };

  getreqfullscreen = () => {
    const { id } = this.state;
    const ele = document.getElementById(id);
    this.setState({
      height: 2000,
      width: 2000,
    });
    if (ele) {
      if (screenfull.isEnabled) {
        screenfull.request(ele);
        screenfull.on('change', () => {
          if (!screenfull.isFullscreen) {
            this.setState({
              height: this.props.height || 700,
              width: this.props.width || 800,
            });
          }
        });
      }
    }
  };

  render() {
    const { height, width, id } = this.state;
    const { value, language, options } = this.props;

    return (
      <div id={id}>
        <MonacoEditor
          width={width}
          height={`${height}px`}
          language={language}
          theme="vs-dark"
          value={value}
          editorWillMount={this.editorWillMount}
          onChange={this.onChange}
          options={options}
        />
        <Button size="small" onClick={this.getreqfullscreen}>
          全屏
        </Button>
      </div>
    );
  }
}

export default AnotherEditor;

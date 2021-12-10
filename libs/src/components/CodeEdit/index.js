import React from 'react';
import { Button, notification } from 'antd';
import MonacoEditor from 'react-monaco-editor';

class AnotherEditor extends React.Component {
  constructor(props) {
    super();
    this.state = {
      code: props.language === 'json' ? '{}' : '',
      language: 'json',
      isError: false,
    };
  }

  componentDidMount() {
    const { code: propsCode, language } = this.props;
    if (language === 'json') {
      this.setState({
        code: JSON.stringify(propsCode, null, 2),
      });
      return;
    }
    this.setState({
      code: propsCode,
    });
  }
  // componentDidUpdate() {
  //   const { code: propsCode, language } = this.props;
  //   const { code } = this.state;
  //   let newCode = propsCode;
  //   if (language === 'json') {
  //     newCode = JSON.stringify(propsCode, null, 2);
  //   }
  //   console.log('newCodenewCode', newCode);
  //   if (code !== newCode) {
  //     this.setState({
  //       code: newCode,
  //     });
  //   }
  // }

  updateState = data => {
    this.setState(data);
  };

  editorWillMount = monaco => {
    const { language } = this.props;

    this.setState({
      monaco,
    });

    try {
      if (language === 'javascript') {
        monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: false,
          noSyntaxValidation: false,
        });
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
          target: monaco.languages.typescript.ScriptTarget.ES6,
          allowNonTsExtensions: true,
        });
        // monaco.editor.setModelMarkers(model, 'eslint', [
        //   {
        //     startLineNumber: 2,
        //     endLineNumber: 2,
        //     startColumn: 2,
        //     endColumn: 4,
        //     message: 'Syntax error',
        //     severity: 3,
        //     source: 'ESLint',
        //     code: 'asdasdas',
        //   },
        // ]);
      }
      if (language === 'json') {
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
      }
    } catch (err) {
      console.log('editorWillMount err', err.message);
    }
  };

  btnClick = () => {
    const { code } = this.state;
    const { update, language, validateCallback } = this.props;
    let isError = false;

    if (language === 'javascript') {
      if (validateCallback && !validateCallback(code)) {
        notification.open({
          message: 'Error',
          description: 'js格式有误',
        });
        return;
      }

      update(code);
      return;
    }

    if (language === 'json') {
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
    }
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
    const { disCode, language = 'json' } = this.props;

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

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution';
// import 'monaco-editor/esm/vs/editor/editor.worker.js'
import 'monaco-editor/esm/vs/language/json/monaco.contribution';
import 'monaco-editor/esm/vs/language/typescript/monaco.contribution';

import 'monaco-editor/esm/vs/editor/contrib/gotoError/gotoError';
import 'monaco-editor/esm/vs/editor/contrib/format/format';
import 'monaco-editor/esm/vs/editor/standalone/browser/accessibilityHelp/accessibilityHelp';
import 'monaco-editor/esm/vs/editor/contrib/bracketMatching/bracketMatching';
import 'monaco-editor/esm/vs/editor/contrib/caretOperations/caretOperations';
import 'monaco-editor/esm/vs/editor/contrib/clipboard/clipboard';
import 'monaco-editor/esm/vs/editor/contrib/codeAction/codeActionContributions';
import 'monaco-editor/esm/vs/editor/contrib/codelens/codelensController';
import 'monaco-editor/esm/vs/editor/contrib/colorPicker/colorDetector';
import 'monaco-editor/esm/vs/editor/contrib/comment/comment';
import 'monaco-editor/esm/vs/editor/contrib/contextmenu/contextmenu';
import 'monaco-editor/esm/vs/editor/browser/controller/coreCommands';
import 'monaco-editor/esm/vs/editor/contrib/cursorUndo/cursorUndo';
import 'monaco-editor/esm/vs/editor/contrib/dnd/dnd';
import 'monaco-editor/esm/vs/editor/contrib/find/findController';
import 'monaco-editor/esm/vs/editor/contrib/folding/folding';
import 'monaco-editor/esm/vs/editor/contrib/fontZoom/fontZoom';
import 'monaco-editor/esm/vs/editor/contrib/format/formatActions';
import 'monaco-editor/esm/vs/editor/standalone/browser/quickOpen/gotoLine';
import 'monaco-editor/esm/vs/editor/contrib/gotoSymbol/goToCommands';
import 'monaco-editor/esm/vs/editor/contrib/gotoSymbol/link/goToDefinitionAtPosition';
import 'monaco-editor/esm/vs/editor/contrib/hover/hover';
import 'monaco-editor/esm/vs/editor/standalone/browser/iPadShowKeyboard/iPadShowKeyboard';
import 'monaco-editor/esm/vs/editor/contrib/inPlaceReplace/inPlaceReplace';

import 'monaco-editor/esm/vs/editor/standalone/browser/inspectTokens/inspectTokens';
import 'monaco-editor/esm/vs/editor/contrib/linesOperations/linesOperations';
import 'monaco-editor/esm/vs/editor/contrib/links/links';
import 'monaco-editor/esm/vs/editor/contrib/multicursor/multicursor';
import 'monaco-editor/esm/vs/editor/contrib/parameterHints/parameterHints';
import 'monaco-editor/esm/vs/editor/standalone/browser/quickOpen/quickCommand';
import 'monaco-editor/esm/vs/editor/standalone/browser/quickOpen/quickOutline';
import 'monaco-editor/esm/vs/editor/standalone/browser/referenceSearch/standaloneReferenceSearch';
import 'monaco-editor/esm/vs/editor/contrib/rename/rename';
import 'monaco-editor/esm/vs/editor/contrib/smartSelect/smartSelect';
import 'monaco-editor/esm/vs/editor/contrib/snippet/snippetController2';
import 'monaco-editor/esm/vs/editor/contrib/suggest/suggestController';
import 'monaco-editor/esm/vs/editor/standalone/browser/toggleHighContrast/toggleHighContrast';
import 'monaco-editor/esm/vs/editor/contrib/toggleTabFocusMode/toggleTabFocusMode';
import 'monaco-editor/esm/vs/editor/contrib/caretOperations/transpose';
import 'monaco-editor/esm/vs/editor/contrib/wordHighlighter/wordHighlighter';
import 'monaco-editor/esm/vs/editor/contrib/wordOperations/wordOperations';
import 'monaco-editor/esm/vs/editor/contrib/wordPartOperations/wordPartOperations';

import PropTypes from 'prop-types';
import React from 'react';
import { noop, processSize } from './utils';

// const base = 'monaco-editor/esm'
//   for(const v of  arr){
//     if(isString(v)){
//       import `${base}`
//     }
//   }

// function  regFea(arr) {

// }

class MonacoEditor extends React.Component {
  constructor(props) {
    super(props);
    this.containerElement = undefined;
  }

  componentDidMount() {
    // const { value, language, theme, height, options, width } = this.props;
    // const { editor } = this;
    // const model = editor.getModel();
    // monaco.editor.setModelLanguage(model, language);
    this.initMonaco();
  }

  componentDidUpdate(prevProps) {
    const { value, language, theme, height, options, width } = this.props;

    const { editor } = this;
    const model = editor.getModel();

    if (this.props.value != null && this.props.value !== model.getValue()) {
      this.__prevent_trigger_change_event = true;
      this.editor.pushUndoStop();
      model.pushEditOperations(
        [],
        [
          {
            range: model.getFullModelRange(),
            text: value,
          },
        ],
      );
      this.editor.pushUndoStop();
      this.__prevent_trigger_change_event = false;
    }

    if (prevProps.language !== language) {
      monaco.editor.setModelLanguage(model, language);
    }
    if (prevProps.theme !== theme) {
      monaco.editor.setTheme(theme);
    }
    if (editor && (width !== prevProps.width || height !== prevProps.height)) {
      editor.layout();
    }
    if (prevProps.options !== options) {
      editor.updateOptions(options);
    }
  }

  componentWillUnmount() {
    this.destroyMonaco();
  }

  assignRef = component => {
    this.containerElement = component;
  };

  destroyMonaco() {
    if (this.editor) {
      this.editor.dispose();
      const model = this.editor.getModel();
      if (model) {
        model.dispose();
      }
    }
    if (this._subscription) {
      this._subscription.dispose();
    }
  }

  initMonaco() {
    const value = this.props.value != null ? this.props.value : this.props.defaultValue;
    const { language, theme, options, overrideServices } = this.props;
    console.log('initMonacoinitMonaco', language);
    if (this.containerElement) {
      // Before initializing monaco editor
      Object.assign(options, this.editorWillMount());
      this.editor = monaco.editor.create(
        this.containerElement,
        {
          value,
          language,
          ...options,
          ...(theme ? { theme } : {}),
        },
        overrideServices,
      );
      // After initializing monaco editor
      this.editorDidMount(this.editor);
    }
  }

  editorWillMount() {
    const { editorWillMount } = this.props;
    const options = editorWillMount(monaco);
    console.log('editorWillMount optionsoptions', options);
    return options || {};
  }

  editorDidMount(editor) {
    this.props.editorDidMount(editor, monaco);

    this._subscription = editor.onDidChangeModelContent(event => {
      if (!this.__prevent_trigger_change_event) {
        this.props.onChange(editor.getValue(), event);
      }
    });
  }

  render() {
    const { width, height } = this.props;
    const fixedWidth = processSize(width);
    const fixedHeight = processSize(height);
    const style = {
      width: fixedWidth,
      height: fixedHeight,
    };

    return <div ref={this.assignRef} style={style} className="react-monaco-editor-container" />;
  }
}

MonacoEditor.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  language: PropTypes.string,
  theme: PropTypes.string,
  options: PropTypes.object,
  overrideServices: PropTypes.object,
  editorDidMount: PropTypes.func,
  editorWillMount: PropTypes.func,
  onChange: PropTypes.func,
};

MonacoEditor.defaultProps = {
  width: '100%',
  height: '100%',
  value: null,
  defaultValue: '',
  language: 'javascript',
  theme: null,
  options: {},
  overrideServices: {},
  editorDidMount: noop,
  editorWillMount: noop,
  onChange: noop,
};

export default MonacoEditor;

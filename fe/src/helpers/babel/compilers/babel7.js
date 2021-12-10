import Base from './base';
import $script from 'scriptjs';

// Disable modules so we do not insert use-strict
// on the first line.
const ES2015 = [
  'es2015',
  {
    modules: false,
  },
];

const acornUrl = 'https://cdnjs.cloudflare.com/ajax/libs/acorn/7.0.0/acorn.min.js';
const babelUrl = 'https://unpkg.com/@babel/standalone@7.10.2/babel.min.js';

export default class Babel extends Base {
  names = [];

  loadCompiler() {
    $script([babelUrl, acornUrl], () => {
      this.compiler = window.Babel;
      this.babelAcorn = window.acorn;
      this.resolveFuture();
    });
  }

  compile(input, options) {
    this._checkIfCompilerIsLoaded();
    let code = '',
      errors = [];
    let names = [];
    const visitor = {
      CallExpression(path) {
        names.push(path.node.callee.name);
        path.traverse({});
      },
    };
    const babelPlugin = { visitor };
    try {
      code = this.compiler.transform(input, {
        presets: [ES2015, 'env'],
        plugins: [babelPlugin],
      }).code;
    } catch (e) {
      console.log('e', e.message);
      errors = [e];
    }
    this.names = names;
    return {
      code,
      errors,
      names,
    };
  }
  getNames() {
    return this.names;
  }
}

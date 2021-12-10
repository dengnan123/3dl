import Babel from './babel7';

export const DEFAULT_COMPILER = 'Babel (6)';

export function getCompiler(name) {
  if (!compilers.hasOwnProperty(name)) {
    throw new ReferenceError(
      `Unexpected compiler naem ${name} please pick one of ${Object.keys(compilers)}`,
    );
  }

  return compilers[name];
}

// const compilers = {
//   Babel7: new Babel(),
// };

const compilers = new Babel();
window.babelCompiler = compilers; // 提供全局使用
export default compilers;

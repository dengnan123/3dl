export function isEmpty(obj) {
  return obj === null || obj === undefined;
}

export function trimRounded(str, depth) {
  return str.substring(depth, str.length - depth);
}

//learn from vue: https://github.com/vuejs/vue/blob/1.1/src/parsers/expression.js#L28
const DOT_NOTATION_PROPERTY_EXPRESSION = /^[A-Za-z_$][\w$]*$/;
const BRACKET_NOTATION_PROPERTY_EXPRESSION = /^(\['.*?'\]|\[".*?"\]|\[\d+\])$/;

const dotNotation = trimRounded(DOT_NOTATION_PROPERTY_EXPRESSION.source, 1);
const bracketNotation = trimRounded(BRACKET_NOTATION_PROPERTY_EXPRESSION.source, 2);

// Final expression:
// /^([A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\])(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\])*$/;
const PATH_EXPRESSION = new RegExp(
  '^(' +
    dotNotation +
    '|' +
    bracketNotation +
    ')(?:\\.' +
    dotNotation +
    '|' +
    bracketNotation +
    ')*$',
);

export function isPathValid(path) {
  return PATH_EXPRESSION.test(path);
}

export function parse(obj, path, defaultVal) {
  try {
    // eslint-disable-next-line no-new-func
    const result = new Function('obj', `return obj${path.startsWith('[') ? '' : '.'}${path};`)(obj);
    if (!isEmpty(result)) {
      return result;
    }
    return isEmpty(defaultVal) ? result : defaultVal;
  } catch (error) {
    return defaultVal;
  }
}

export function reap(obj, path, defaultVal, extraHandler) {
  if (isEmpty(obj)) {
    return defaultVal;
  }

  if (isEmpty(path)) {
    throw new Error('[path] must not be null/undefined');
  }

  if (!isPathValid(path)) {
    throw new Error(
      'invalid path, check out: https://github.com/leftstick/../../../../components/SafeReaper/blob/master/README.md#accept-expression',
    );
  }

  const value = parse(obj, path, defaultVal);

  if (!extraHandler || typeof extraHandler !== 'function') {
    return value;
  }

  return extraHandler(value);
}

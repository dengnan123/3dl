import * as replace from 'replace-in-file';
import * as path from 'path';
import * as fs from 'fs-extra';

export const repRequire = filePath => {
  console.log('filePath rep', filePath);
  const fileNames = fs.readdirSync(filePath);

  const filePathArr = fileNames.map(v => {
    return `${filePath}/${v}/*.js`;
  });

  const a = `
  var hasOwn = {}.hasOwnProperty;
  function classNames () {
    var classes = [];
  
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i];
      if (!arg) continue;
  
      var argType = typeof arg;
  
      if (argType === 'string' || argType === 'number') {
        classes.push(arg);
      } else if (Array.isArray(arg) && arg.length) {
        var inner = classNames.apply(null, arg);
        if (inner) {
          classes.push(inner);
        }
      } else if (argType === 'object') {
        for (var key in arg) {
          if (hasOwn.call(arg, key) && arg[key]) {
            classes.push(key);
          }
        }
      }
    }
  
    return classes.join(' ');
  }
  
  
  `;

  const b = function test() {};

  const fromInit = [
    /require\('mutationobserver-shim'\)/g,
    /var classNames = require\('classnames'\)/g,
    /require\('load-styles'\)/,
  ];

  const options = {
    files: filePathArr,
    from: fromInit,
    to: ["'console.log()'", `${a}`, `${b}`],
  };

  console.log('optionsoptions', options);

  try {
    const results = replace.sync(options);
    console.log('Replacement results:', results);
  } catch (error) {
    console.error('Error occurred:', error);
  }
};

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.test = factory());
}(this, (function () { 'use strict';

  const test = {
    w: 1,
    r: 2,
  };

  const a = {
    b: 123123,
    ...test,
  };

  return a;

})));

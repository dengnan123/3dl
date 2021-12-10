export const injectDataToEveryComp = (arr, opts) => {
  const doFunc = arr => {
    if (!arr?.length) {
      return [];
    }
    return arr.map(v => {
      const { child } = v;
      const newChild = doFunc(child);
      return {
        ...v,
        ...opts,
        child: newChild,
      };
    });
  };
  return doFunc(arr);
};

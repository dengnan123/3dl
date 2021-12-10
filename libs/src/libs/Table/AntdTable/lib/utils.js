export const getFixedConfig = ({ isFixed, left, right, len, width, childrenArr }, index) => {
  if (!isFixed) {
    return { itemConfig: {} };
  }
  let itemConfig = {};
  let itemChildren = null;

  const setChildren = arr => {
    if (!arr) {
      return;
    }
    return arr.map(a => {
      if (a.children) {
        return {
          ...a,
          children: setChildren(a.children),
        };
      }
      return {
        ...a,
        width: width,
      };
    });
  };

  if (index < left) {
    itemConfig['fixed'] = 'left';
    itemConfig['width'] = width;
    itemChildren = setChildren(childrenArr);
  }

  if (index >= len - right) {
    itemConfig['fixed'] = 'right';
    itemConfig['width'] = width;
    itemChildren = setChildren(childrenArr);
  }

  return { itemConfig, itemChildren };
};

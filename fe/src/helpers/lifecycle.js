export const getLifecycleFuncs = ({ pageShellEs5Code }) => {
  if (!pageShellEs5Code) {
    return {};
  }
  // eslint-disable-next-line no-new-func
  const pageShellFunc = new Function('lang', `${pageShellEs5Code}`);
  try {
    const { onPageMount, onPageUnMount } = pageShellFunc();
    return {
      onPageMount,
      onPageUnMount,
    };
  } catch (err) {
    console.log('getLifecycleFuncs err ', err);
    return {};
  }
};

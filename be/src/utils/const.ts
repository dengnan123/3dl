export const getQueryInitParameters = (queryInfo) => {
  const parameters = queryInfo?.options?.parameters || [];
  if (!parameters.length) {
    return {};
  }
  return parameters.reduce((pre, next) => {
    const { name, value } = next;
    return {
      ...pre,
      [name]: value,
    };
  }, {});
};

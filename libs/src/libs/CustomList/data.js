export default {
  dataSource: Array(15)
    .fill(0)
    .map((n, i) => ({
      id: i + 1,
      name: `小明-${i + 1}`,
      staffNum: '8909091',
      label: `小明-${i + 1}(8909091)`,
    })),
};

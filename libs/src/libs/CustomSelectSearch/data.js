export default Array(20)
  .fill(0)
  .map((n, i) => ({
    id: i + 1,
    name: `abc-${i + 1}`,
  }));

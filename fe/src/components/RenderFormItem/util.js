export const getRenderList = ({ col, fileds }) => {
  let result = []
  for (var i = 0, len = fileds.length; i < len; i += col) {
    result.push(fileds.slice(i, i + col))
  }
  return result
}
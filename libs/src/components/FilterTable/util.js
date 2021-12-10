/**
 * polyfill closest
 * @export
 * @param {*} el
 * @param {*} target
 * @returns
 */
export function closestPolyfill(el, target) {
  if (!el || !target) return null
  const nodeName = target.toUpperCase()
  return loopFindClosest(el, nodeName)
}
function loopFindClosest(el, nodeName) {
  if (el.nodeName === nodeName) {
    return el
  }
  return loopFindClosest(el.parentNode, nodeName)
}

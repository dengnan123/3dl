export const getAnimateStyle = compProps => {
  const delay = compProps?.basicStyle?.inAnimation?.delay;
  const duration = compProps?.basicStyle?.inAnimation?.duration;
  let sty = {};
  if (delay) {
    sty['animationDelay'] = delay;
  }
  if (duration) {
    sty['animationDuration'] = duration;
  }
  return sty;
};

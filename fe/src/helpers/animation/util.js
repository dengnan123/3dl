import anime from 'animejs/lib/anime.es.js';
import { filterDataFunc } from '@/helpers/screen';

export function isNullOrUndefined(obj) {
  return obj === null || obj === undefined;
}

export function getAnimateClassNames(animationFields) {
  const { name, custom = false } = animationFields || {};

  let animateClassNames = '';
  if (custom) {
    return animateClassNames;
  }
  if (!isNullOrUndefined(name)) {
    animateClassNames = `animate__animated ${name || ''}`;
  }
  return animateClassNames;
}

export function getAnimateStyles(animationFields) {
  const { delay, duration, direction, loop, iterationCount = 1, custom = false } =
    animationFields || {};
  const animateStyles = {};
  if (custom) {
    return animateStyles;
  }
  if (!isNullOrUndefined(delay)) {
    animateStyles['animationDelay'] = `${delay}s`;
  }
  if (!isNullOrUndefined(duration)) {
    animateStyles['animationDuration'] = `${duration}s`;
  }
  if (!isNullOrUndefined(direction)) {
    animateStyles['animationDirection'] = direction;
  }
  if (loop || !isNullOrUndefined(iterationCount)) {
    animateStyles['animationIterationCount'] = loop ? 'infinite' : iterationCount;
  }
  return animateStyles;
}

export function doAnimation(targets, animationFields) {
  try {
    const { custom = false, animationConfigFilterFunc } = animationFields || {};
    const animateList = filterDataFunc({ filterFunc: animationConfigFilterFunc });

    if (
      !animateList ||
      !(animateList instanceof Array) ||
      !animateList.length ||
      !targets ||
      !custom
    ) {
      return;
    }
    const action = async () => {
      for (let i = 0; i < animateList.length; i++) {
        const config = animateList[i] || {};

        const _animate = anime({ ...config, targets });
        await _animate.finished;
      }
    };
    action();
  } catch (err) {
    console.log('动画错误', err.message);
  }
}

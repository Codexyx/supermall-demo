//防抖函数，用于解决调用scroll组件的refresh重新计算滚动区域过于频繁的问题
export function debouncs(func, delay) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  }
}

/*
  Accurate_Interval.js by Squeege and modified by Peter Weinberg
  https://codepen.io/no_stack_dub_sack/pen/VKJGKd?editors=1010 
*/

function accurateInterval(fn, time){
  let cancel, nextAt, timeout, wrapper
  nextAt = new Date().getTime() + time
  wrapper = () => {
    nextAt += time
    timeout = setTimeout(wrapper, nextAt - new Date().getTime())
    return fn()
  }
  cancel = () => { 
    return clearTimeout(timeout) 
  }
  timeout = setTimeout(wrapper, nextAt - new Date().getTime())
  return { cancel: cancel }
}

export default accurateInterval;
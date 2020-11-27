
const oneMinute = 60000
const requestLimit = 120
const defaultTDApiTimeLimit = (oneMinute / requestLimit)

module.exports = function waitFor(timeMs) {
  const time = timeMs || defaultTDApiTimeLimit;
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}
/**
 * 延迟实现
 * @param delaySeconds 延迟时间(单位:秒)
 */
export default (delaySeconds = 1) => {
  console.log(`手动延迟:${delaySeconds}秒`)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, delaySeconds * 1000)
  });
}

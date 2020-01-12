/**
 * 验证url信息是否完全相同
 * @param aUrlInfo {{
 *   kw:{string|undefined},
 *   httpType:string,
 *   pathname:string,
 *   swaggerUri:string,
 *   apiKey:{string|undefined}
 * }}
 * @param bUrlInfo {{
 *   kw:{string|undefined},
 *   httpType:string,
 *   pathname:string,
 *   swaggerUri:string,
 *   apiKey:{string|undefined}
 * }}
 * @return {boolean}
 */
function validateUrlIsSame(aUrlInfo, bUrlInfo) {
  const paramNames = ['httpType', 'pathname', 'swaggerUri', 'apiKey', 'kw']
  return paramNames.every(item => {
    return aUrlInfo[item] === bUrlInfo[item]
  })
}

export default validateUrlIsSame

export default (docRespData, httpType) => {
  const {swagger, info, host, basePath} = docRespData
  return {
    swagger,
    info,
    host,
    basePath
  }
}

/**
 * 提取需要展开的节点
 * @param list
 * @return {Array}
 */
export default function extractTableExpandedRowKeys(list) {
  const openedKeys = []
  for (const item of list) {
    if (item.children && item.children.length > 0) {
      // 存在子节点,则展开
      openedKeys.push(item.key)

      // 递归查找子节点中需要展开的节点
      const tmpOpenedKeys = extractTableExpandedRowKeys(item.children)
      if (tmpOpenedKeys.length > 0) {
        openedKeys.push(...tmpOpenedKeys)
      }
    }
  }
  return openedKeys
}

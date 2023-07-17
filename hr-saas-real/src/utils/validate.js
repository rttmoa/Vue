/**
 * Created by PanJiaChen on 16/11/18.
 */






/* 是否是外部链接 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/* 校验用户名 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 登陆 + 校验手机号 */
export function validMobile(str) {
  return /^1[3-9]\d{9}$/.test(str)
}

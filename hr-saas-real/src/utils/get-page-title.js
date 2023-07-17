import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Vue Admin Template'



/** #### TODO: 获取页标题  ---*/
export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}

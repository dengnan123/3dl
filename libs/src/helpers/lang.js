export const isChinese = locale => {
  return locale === 'zh-CN';
};

/**
 * 解析如 '中文名称/English name' 的双语名称
 * @param {String} lang zh-CN/en-US 语言，可选
 * @param {String} zhName 中文名
 * @param {String} enName 英文名
 * @return {String} 解析后的值
 */
export const getNameByLang = (lang = 'zh-CN', zhName, enName) => {
  const zhValue = zhName || enName;
  const enValue = enName || zhName;
  return isChinese(lang) ? zhValue : enValue;
};

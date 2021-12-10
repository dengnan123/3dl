import * as fs from 'fs-extra';

export const getStaticJsName = (pageId, isDefault) => {
  if (isDefault) {
    return {
      pageCompkey: `def-pageComp.js`,
      pageKey: `def-page.js`,
      dataSoureceKey: `def-dataSource.js`,
    };
  }
  return {
    pageCompkey: `${pageId}-pageComp.js`,
    pageKey: `${pageId}-page.js`,
    dataSoureceKey: `${pageId}-dataSource.js`,
  };
};

/**
 * 加上根据默认页面ID，加上def js
 */
export const addDefJs = (filePath, pageId) => {
  const arr = [
    {
      oldP: `${pageId}-pageComp.js`,
      newP: `def-pageComp.js`,
    },
    {
      oldP: `${pageId}-page.js`,
      newP: `def-page.js`,
    },
    {
      oldP: `${pageId}-dataSource.js`,
      newP: `def-dataSource.js`,
    },
  ];
  for (const v of arr) {
    const { oldP, newP } = v;
    const jsPath = `${filePath}/${oldP}`;
    const defJsPath = `${filePath}/${newP}`;
    if (fs.existsSync(jsPath)) {
      fs.copySync(jsPath, defJsPath);
    }
  }
};
// import * as puppeteer from 'puppeteer';
// import * as path from 'path';
// import * as fs from 'fs-extra';

// const shot = async () => {
//   const str = process.argv[2];
//   const data = JSON.parse(str); // 获取参数
//   const { pageList, picPath } = data;

//   const browser = await puppeteer.launch({
//     args: ['--no-sandbox'],
//     headless: false,
//   });

//   const doPage = async (v) => {
//     const { pageId, tagId, pageWidth, pageHeight } = v;
//     console.log('pageIdpageId', pageId);
//     const page = await browser.newPage();
//     const url = `https://3dl.dfocus.top/preview?pageId=${pageId}&tagId=${tagId}`;
//     await page.goto(url, {
//       waitUntil: 'networkidle2',
//     });
//     await page.setViewport({
//       width: pageWidth,
//       height: pageHeight,
//     });
//     await page.waitForTimeout(20000);
//     // await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 50000 })
//     await page.screenshot({
//       path: `${picPath}/${pageId}.png`,
//       fullPage: true,
//     });
//   };
//   const promissArr = pageList.map(async (v) => {
//     return await doPage(v);
//   });
//   await Promise.all(promissArr);
//   await browser.close();
// };

// shot();

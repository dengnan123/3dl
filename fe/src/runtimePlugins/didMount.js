import { isProduction } from '@/helpers/env';
const showConsole = !isProduction ? false : 'SHOW_VCONSOLE';

export const addVconsole = () => {
  if (showConsole === 'true') {
    // 插入vconsole .js
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'UMI_PUBLIC_PATH/js/vconsole.min.js';
    document.body.appendChild(script);
    setTimeout(() => {
      // eslint-disable-next-line no-undef
      new VConsole();
    }, 1000);
  }
};

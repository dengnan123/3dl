import { withMixin } from '../helpers/dva';

import dfocus from '../injected/models/dfocus/index';
import { injectedModule } from '../config';

window.injectedModule = injectedModule;

const INJECTED_MAP = {
  dfocus,
};

if (!INJECTED_MAP[injectedModule]) {
  throw new Error(`env [${injectedModule}] is not injected correctly`);
}

const injected = INJECTED_MAP[injectedModule];

export default withMixin({
  ...injected,
});

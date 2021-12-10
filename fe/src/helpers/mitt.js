import { getParseSearch } from '@/helpers/utils';
import mitt from 'mitt';
const { pageId } = getParseSearch();
let emitter;
if (!window.emitter) {
  emitter = mitt();
  window.emitter = emitter
  console.log('emitter实例化___', pageId, emitter);
} else {
  emitter = window.emitter;
}
export default emitter;

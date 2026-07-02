import {initialize} from './initialize.js';
import {loadConfig} from './loadConfig.js';
import {loadRouter} from './loadRouter.js';
import {finish} from './finish.js';

export async function start(){
  initialize();
  await loadConfig();
  loadRouter();
  finish();
}

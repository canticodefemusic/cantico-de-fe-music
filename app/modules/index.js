import {ModuleManager} from './core/ModuleManager.js';
import {DashboardModule,CmsModule} from './registry/defaultModules.js';

export const moduleManager=new ModuleManager();

export async function loadModules(){
 moduleManager.register('dashboard',new DashboardModule());
 moduleManager.register('cms',new CmsModule());
 await moduleManager.bootAll();
}

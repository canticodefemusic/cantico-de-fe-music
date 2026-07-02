import {Module} from '../contracts/Module.js';

export class DashboardModule extends Module{
 constructor(){super('dashboard');}
 async register(){console.log('Dashboard register');}
 async boot(){console.log('Dashboard boot');}
}

export class CmsModule extends Module{
 constructor(){super('cms');}
 async register(){console.log('CMS register');}
 async boot(){console.log('CMS boot');}
}

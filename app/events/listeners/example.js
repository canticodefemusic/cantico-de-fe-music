import {eventBus} from '../index.js';
import {Events} from '../channels/system.js';

eventBus.on(Events.HYMN_SAVED,(hymn)=>{
 console.log('Nuevo himno:',hymn?.title);
});

eventBus.on('*',(e)=>{
 console.log('[EVENT]',e.event,e.payload);
});

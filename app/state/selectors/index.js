import {store} from '../index.js';
export const selectors={
 theme:()=>store.getState().theme,
 currentHymn:()=>store.getState().currentHymn,
 notifications:()=>store.getState().notifications
};

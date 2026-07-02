import {store} from '../index.js';
export const actions={
 setTheme(theme){store.setState({theme})},
 setCurrentHymn(hymn){store.setState({currentHymn:hymn})},
 addNotification(message){
   const s=store.getState();
   store.setState({notifications:[...s.notifications,message]});
 }
};

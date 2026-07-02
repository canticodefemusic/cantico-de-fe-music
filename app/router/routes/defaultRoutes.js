import {router} from '../index.js';
export function registerDefaultRoutes(){
 router.register('/',()=>document.getElementById('app').innerHTML='<h1>Inicio</h1>');
 router.register('/dashboard',()=>document.getElementById('app').innerHTML='<h1>Dashboard</h1>');
 router.register('*',()=>document.getElementById('app').innerHTML='<h1>404</h1>');
}

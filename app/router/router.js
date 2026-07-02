export class Router{
constructor(){this.routes=new Map();}
register(path,handler){this.routes.set(path,handler);}
navigate(path){
 history.pushState({},'',path);
 this.render(path);
}
render(path){
 const fn=this.routes.get(path)||this.routes.get('*');
 if(fn) fn();
}
start(){
 window.addEventListener('popstate',()=>this.render(location.pathname));
 this.render(location.pathname);
 console.log('[Router] started');
}
}

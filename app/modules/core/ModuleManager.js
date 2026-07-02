export class ModuleManager{
 constructor(){this.modules=new Map();}
 register(name,module){this.modules.set(name,module);}
 async bootAll(){
   for(const [name,m] of this.modules){
     if(m.register) await m.register();
     if(m.boot) await m.boot();
     console.log('[Module]',name,'booted');
   }
 }
 async destroy(name){
   const m=this.modules.get(name);
   if(!m) return;
   if(m.destroy) await m.destroy();
   this.modules.delete(name);
 }
 get(name){return this.modules.get(name);}
 list(){return [...this.modules.keys()];}
}

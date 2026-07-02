export class EventBus{constructor(){this.e={}}on(n,f){(this.e[n]??=[]).push(f)}emit(n,d){(this.e[n]||[]).forEach(f=>f(d))}}
